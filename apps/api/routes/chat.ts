import { Router, Request, Response } from "express";
import { DevBrain } from "../core/brain";
import { VectorStore } from "../../../services/memory/vectorStore";

const router = Router();
const store = new VectorStore();
const brain = new DevBrain(store);

router.post("/", async (req: Request, res: Response) => {
  const { question } = req.body as { question?: string };

  if (!question) {
    res.status(400).json({ error: "question is required" });
    return;
  }

  try {
    const answer = await brain.ask(question);
    res.json({ answer });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

router.get("/summary", async (_req: Request, res: Response) => {
  try {
    const summary = await brain.summarize();
    res.json({ summary });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

export default router;
