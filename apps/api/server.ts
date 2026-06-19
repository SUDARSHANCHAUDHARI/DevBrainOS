import express, { type Express } from "express";
import chatRouter from "./routes/chat";
import scanRouter from "./routes/scan";
import debugRouter from "./routes/debug";
import gitRouter from "./routes/git";

const app: Express = express();
const PORT = process.env.PORT ?? 3737;

app.use(express.json({ limit: "10mb" }));

app.use("/api/chat", chatRouter);
app.use("/api/scan", scanRouter);
app.use("/api/debug", debugRouter);
app.use("/api/git", gitRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", version: "1.0.0" });
});

app.listen(PORT, () => {
  console.log(`DevBrainOS API running at http://localhost:${PORT}`);
  console.log(`\nEndpoints:`);
  console.log(`  POST /api/scan       { dir: "/path" }         — index a project`);
  console.log(`  POST /api/chat       { question: "..." }      — ask about codebase`);
  console.log(`  POST /api/debug/audit { dir: "/path" }        — full AI audit`);
  console.log(`  GET  /api/git/commits                         — recent commits`);
  console.log(`  GET  /api/git/analyze                         — AI git analysis`);
});

export default app;
