# DevBrainOS

> AI that understands your entire codebase — not just files.

DevBrainOS is a local-first, multi-agent AI system that builds a persistent "brain" for your project. It scans your repo using AST + semantic embeddings, stores knowledge in SQLite, and lets you chat with your codebase, run full audits, and analyze git history — all running locally via Ollama.

---

## Table of Contents

- [What it does](#what-it-does)
- [Stack](#stack)
- [Setup](#setup)
- [API Server](#api-server)
- [Web Dashboard](#web-dashboard)
- [Project Structure](#project-structure)
- [License](#license)
- [About](#about)

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
GET  /api/chat/summary                           — summarize indexed codebase
POST /api/debug/audit { "dir": "/path" }        — full AI audit (4 agents in parallel)
GET  /api/git/commits                            — recent commits
GET  /api/git/analyze                            — AI git analysis
GET  /api/git/diff                               — diff of last commit
GET  /api/git/changed                            — currently changed files
GET  /api/scan/status                            — indexed file count
GET  /health                                     — server health
```

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama host (change if running remotely or on a different port) |
| `PORT` | `3737` | API server port |

```bash
OLLAMA_BASE_URL=http://192.168.1.10:11434 npm run server
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

## License

MIT

---

## About

I'm Sudarshan Chaudhari, a Senior Quality Engineer, Test Automation specialist, and AI systems builder based in Bangkok, Thailand.

I have 13+ years of experience in software quality engineering, working across SaaS, fintech, gaming, web, mobile, cloud, and digital signage platforms. My background combines hands-on test automation with QA leadership, test strategy, CI/CD, release quality, production investigation, and cross-platform validation.

Alongside my professional QA career, I run [SudarshanTechLabs](https://sudarshantechlabs.com/), my independent engineering and product lab where I design, build, test, and ship software across Android, web, AI, cybersecurity, developer tooling, and cross-platform applications.

### What I work on

- ⚙️ **Quality Engineering & Test Automation** — Playwright, Selenium, Cypress, Appium, API testing, automation frameworks, end-to-end testing, CI/CD, release gates, GitHub Actions, risk-based testing, and production validation
- 🤖 **AI Systems & Automation** — AI agents, multi-agent orchestration, MCP servers, AI-assisted QA, prompt tooling, developer workflows, automation systems, and Claude Code plugins
- 📱 **Mobile & Cross-Platform Applications** — Android applications built with Kotlin and Jetpack Compose, Google Play releases, automated build and publishing pipelines, and cross-platform development spanning iOS, web, Windows, and macOS
- 🌐 **Web Applications & Platforms** — Full-stack applications using Next.js, TypeScript, Firebase, Cloudflare, REST APIs, and modern web infrastructure
- 🛠️ **Developer Tooling & CLI Engineering** — Rust, Python, TypeScript, CLI utilities, multi-repository tooling, build automation, release tooling, and engineering productivity systems
- 🛡️ **Cybersecurity & Observability** — Threat detection, log analysis, security auditing, vulnerability assessment, monitoring, and security-focused developer tools
- 📺 **Digital Signage & Device Platforms** — Content validation, playback testing, device compatibility, production investigation, monitoring, and QA across diverse hardware and operating-system environments

My work sits at the intersection of quality engineering, automation, AI, and software development. I approach products with a QA mindset from the beginning: understanding failure modes, designing for testability, automating repetitive work, and building release confidence into the engineering process.

Through SudarshanTechLabs, I also build products and tools from idea to production, covering architecture, development, testing, CI/CD, release automation, monitoring, and ongoing maintenance.

🌐 [sudarshantechlabs.com](https://sudarshantechlabs.com/) · 💼 [LinkedIn](https://linkedin.com/in/sudarshan-chaudhari) · 🐙 [GitHub](https://github.com/SUDARSHANCHAUDHARI) · ✉️ [sunny.sudarshan@gmail.com](mailto:sunny.sudarshan@gmail.com)
