# DevBrainOS

> AI that understands your entire codebase — not just files.

DevBrainOS is a local-first, multi-agent AI system that builds a persistent "brain" for your project. It scans your repo using AST + semantic embeddings, stores knowledge in SQLite, and lets you chat with your codebase, run full audits, and analyze git history — all running locally via Ollama.

---

## What it does

| Command | What happens |
|---|---|
| `scan [dir]` | Recursively indexes your project into a local vector store |
| `chat <question>` | Asks your codebase anything — context-aware answers |
| `audit` | Runs 4 agents in parallel: code review, bug detection, QA edge cases, architecture |
| `git` | Analyzes recent commits with AI reasoning |
| `summary` | Summarizes the indexed codebase |
| `status` | Shows how many files are indexed |

---

## Stack

- **Runtime:** Node.js + TypeScript
- **AI:** [Ollama](https://ollama.ai) (local) — `qwen2.5-coder:7b` + `nomic-embed-text`
- **Storage:** SQLite (via `better-sqlite3`) — persistent across sessions
- **Search:** Cosine similarity vector search (no external vector DB needed)
- **AST Parsing:** TypeScript compiler API — real symbol extraction, not regex
- **API:** Express server at `localhost:3737`
- **Web UI:** `apps/web/index.html` — open directly in browser

---

## Setup

### 1. Install Ollama

```bash
# macOS
brew install ollama

# Or download from https://ollama.ai
```

### 2. Pull models

```bash
ollama pull qwen2.5-coder:7b
ollama pull nomic-embed-text
ollama serve
```

### 3. Install dependencies

```bash
npm install
```

### 4. Scan your project

```bash
npx ts-node apps/cli/index.ts scan /path/to/your/project
```

### 5. Start chatting

```bash
npx ts-node apps/cli/index.ts chat "What does the auth module do?"
npx ts-node apps/cli/index.ts audit
npx ts-node apps/cli/index.ts git
```

---

## API Server

```bash
npm run server
# → http://localhost:3737
```

Endpoints:

```
POST /api/scan        { "dir": "/path" }        — index a project
POST /api/chat        { "question": "..." }      — ask the brain
POST /api/debug/audit                            — full AI audit
GET  /api/git/commits                            — recent commits
GET  /api/git/analyze                            — AI git analysis
GET  /api/scan/status                            — indexed file count
GET  /health                                     — server health
```

---

## Web Dashboard

Open `apps/web/index.html` directly in your browser (no build step needed). Connect to the running API server at `localhost:3737`.

---

## Project Structure

```
devbrainos/
├── apps/
│   ├── api/
│   │   ├── core/         llm.ts, brain.ts
│   │   ├── routes/       chat, scan, debug, git
│   │   └── server.ts
│   ├── cli/index.ts      CLI entry point
│   └── web/index.html    Dashboard UI
├── services/
│   ├── agents/           codeAgent, debugAgent, qaAgent, gitAgent, architectureAgent
│   ├── memory/           db.ts, vectorStore.ts (SQLite + cosine search)
│   ├── scanner/          fileScanner, astParser, indexer, dependencyGraph
│   └── git/              gitAnalyzer.ts
├── config/models.ts      Ollama model config
└── workflows/n8n/        Multi-agent n8n workflow JSON
```

---

## Author

**SudarshanTechLabs** — [@SUDARSHANCHAUDHARI](https://github.com/SUDARSHANCHAUDHARI)

---

## License

MIT
