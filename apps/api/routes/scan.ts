import { Router, Request, Response } from "express";
import { scanDir } from "../../../services/scanner/fileScanner";
import { Indexer } from "../../../services/scanner/indexer";
import { VectorStore } from "../../../services/memory/vectorStore";

const router: Router = Router();
const store = new VectorStore();
const indexer = new Indexer(store);

router.post("/", async (req: Request, res: Response) => {
  const { dir } = req.body as { dir?: string };

  if (!dir) {
    res.status(400).json({ error: "dir is required" });
    return;
  }

  const files = scanDir(dir);
  const results: string[] = [];

  for (const file of files) {
    try {
      await indexer.indexFile(file);
      results.push(file);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`Failed to index ${file}: ${msg}`);
    }
  }

  res.json({ indexed: results.length, files: results });
});

router.get("/status", (_req: Request, res: Response) => {
  const count = store.count();
  res.json({ indexed_files: count });
});

export default router;
