import { Router, Request, Response } from "express";
import { codeAgent } from "../../../services/agents/codeAgent";
import { debugAgent } from "../../../services/agents/debugAgent";
import { qaAgent } from "../../../services/agents/qaAgent";
import { architectureAgent } from "../../../services/agents/architectureAgent";
import { VectorStore } from "../../../services/memory/vectorStore";
import { scanDir } from "../../../services/scanner/fileScanner";
import { buildDependencyGraph } from "../../../services/scanner/dependencyGraph";

const router = Router();
const store = new VectorStore();

router.post("/audit", async (req: Request, res: Response) => {
  const { dir } = req.body as { dir?: string };

  const rows = store.getAll();
  const context = rows.map((r) => r.text).join("\n\n").slice(0, 12000);

  try {
    const [code, debug, qa] = await Promise.all([
      codeAgent(context),
      debugAgent(context),
      qaAgent(context),
    ]);

    let architecture = "Architecture analysis not available (no dir provided)";
    if (dir) {
      const files = scanDir(dir);
      const graph = buildDependencyGraph(files);
      architecture = await architectureAgent(graph);
    }

    res.json({ code, debug, qa, architecture });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

export default router;
