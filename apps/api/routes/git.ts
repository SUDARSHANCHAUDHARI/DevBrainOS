import { Router, Request, Response } from "express";
import { getRecentCommits, getDiffSummary, getChangedFiles } from "../../../services/git/gitAnalyzer";
import { gitAgent } from "../../../services/agents/gitAgent";

const router = Router();

router.get("/commits", async (_req: Request, res: Response) => {
  try {
    const commits = await getRecentCommits(10);
    res.json({ commits });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

router.get("/diff", async (_req: Request, res: Response) => {
  try {
    const diff = await getDiffSummary();
    res.json({ diff });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

router.get("/changed", async (_req: Request, res: Response) => {
  try {
    const files = await getChangedFiles();
    res.json({ files });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

router.get("/analyze", async (_req: Request, res: Response) => {
  try {
    const analysis = await gitAgent();
    res.json({ analysis });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

export default router;
