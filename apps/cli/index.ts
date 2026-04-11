#!/usr/bin/env ts-node

import { scanDir } from "../../services/scanner/fileScanner";
import { Indexer } from "../../services/scanner/indexer";
import { VectorStore } from "../../services/memory/vectorStore";
import { DevBrain } from "../api/core/brain";
import { codeAgent } from "../../services/agents/codeAgent";
import { debugAgent } from "../../services/agents/debugAgent";
import { qaAgent } from "../../services/agents/qaAgent";
import { gitAgent } from "../../services/agents/gitAgent";
import { architectureAgent } from "../../services/agents/architectureAgent";
import { buildDependencyGraph } from "../../services/scanner/dependencyGraph";
import { getRecentCommits } from "../../services/git/gitAnalyzer";

const store = new VectorStore();
const indexer = new Indexer(store);
const brain = new DevBrain(store);

const cmd = process.argv[2];
const args = process.argv.slice(3);

function printHeader(title: string) {
  const line = "─".repeat(50);
  console.log(`\n${line}`);
  console.log(`  ${title}`);
  console.log(`${line}`);
}

function printHelp() {
  console.log(`
DevBrain AI — Project-aware AI for your codebase

COMMANDS:
  scan [dir]            Index a project directory (default: current dir)
  chat <question>       Ask anything about your codebase
  audit [dir]           Run full AI audit (code + bugs + tests + architecture)
  git                   Analyze recent git history
  summary               Summarize the indexed codebase
  status                Show how many files are indexed
  clear                 Clear the memory database

EXAMPLES:
  npx ts-node apps/cli/index.ts scan ./my-project
  npx ts-node apps/cli/index.ts chat "What does the auth module do?"
  npx ts-node apps/cli/index.ts audit
  npx ts-node apps/cli/index.ts git

SETUP:
  1. Install Ollama: https://ollama.ai
  2. Run: ollama pull qwen2.5-coder:7b
  3. Run: ollama pull nomic-embed-text
  4. Start: ollama serve
`);
}

async function runScan() {
  const targetDir = args[0] ?? process.cwd();

  printHeader(`Scanning: ${targetDir}`);
  console.log("Finding files...");

  const files = scanDir(targetDir);
  console.log(`Found ${files.length} files to index\n`);

  await indexer.indexFiles(files, (file, i, total) => {
    process.stdout.write(`\r[${i}/${total}] ${file.split("/").pop()}`);
  });

  console.log(`\n\nScan complete. ${files.length} files indexed.`);
}

async function runChat() {
  const question = args.join(" ");

  if (!question) {
    console.error("Usage: devbrain chat <your question>");
    process.exit(1);
  }

  printHeader("DevBrain Chat");
  console.log(`Question: ${question}\n`);

  const answer = await brain.ask(question);

  printHeader("Answer");
  console.log(answer);
}

async function runAudit() {
  const targetDir = args[0] ?? process.cwd();

  printHeader("DevBrain Full Audit");
  console.log("Running all agents in parallel...\n");

  const rows = store.getAll();

  if (rows.length === 0) {
    console.error("No codebase indexed. Run: devbrain scan [dir]");
    process.exit(1);
  }

  const context = rows.map((r) => r.text).join("\n\n").slice(0, 12000);

  const files = scanDir(targetDir);
  const graph = buildDependencyGraph(files);

  const [code, debug, qa, architecture] = await Promise.all([
    codeAgent(context),
    debugAgent(context),
    qaAgent(context),
    architectureAgent(graph),
  ]);

  printHeader("CODE ANALYSIS");
  console.log(code);

  printHeader("BUG DETECTION");
  console.log(debug);

  printHeader("QA — EDGE CASES");
  console.log(qa);

  printHeader("ARCHITECTURE");
  console.log(architecture);
}

async function runGit() {
  printHeader("Git Intelligence");

  const commits = await getRecentCommits(10);

  if (commits.length === 0) {
    console.log("No git history found in current directory.");
    return;
  }

  console.log("Recent commits:\n");
  commits.forEach((c) => {
    console.log(`  ${c.hash.slice(0, 7)} | ${c.date.slice(0, 10)} | ${c.message}`);
  });

  console.log("\nAnalyzing...\n");
  const analysis = await gitAgent();

  printHeader("AI Git Analysis");
  console.log(analysis);
}

async function runSummary() {
  printHeader("Codebase Summary");
  const summary = await brain.summarize();
  console.log(summary);
}

function runStatus() {
  const count = store.count();
  console.log(`\nDevBrain Memory: ${count} files indexed`);
}

function runClear() {
  store.clear();
  console.log("Memory cleared.");
}

async function main() {
  switch (cmd) {
    case "scan":
      await runScan();
      break;
    case "chat":
      await runChat();
      break;
    case "audit":
      await runAudit();
      break;
    case "git":
      await runGit();
      break;
    case "summary":
      await runSummary();
      break;
    case "status":
      runStatus();
      break;
    case "clear":
      runClear();
      break;
    default:
      printHelp();
  }
}

main().catch((err) => {
  console.error("\nError:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
