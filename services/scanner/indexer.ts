import { readFile } from "./fileScanner";
import { parseTypeScriptFile, buildFileSummary } from "./astParser";
import { embed } from "../../apps/api/core/llm";
import { VectorStore } from "../memory/vectorStore";
import path from "path";

export class Indexer {
  constructor(private store: VectorStore) {}

  async indexFile(filePath: string): Promise<void> {
    const content = readFile(filePath);

    if (content.trim().length < 20) return;

    const ext = path.extname(filePath);
    let textToEmbed = `FILE: ${filePath}\n\n${content}`;

    if (ext === ".ts" || ext === ".tsx") {
      try {
        const parsed = parseTypeScriptFile(filePath);
        const summary = buildFileSummary(parsed);
        textToEmbed = `${summary}\n\nFULL CONTENT:\n${content}`;
      } catch {
        // fall back to raw content if AST parse fails
      }
    }

    const embedding = await embed(textToEmbed);
    this.store.add(filePath, textToEmbed, embedding);
  }

  async indexFiles(filePaths: string[], onProgress?: (file: string, i: number, total: number) => void): Promise<void> {
    for (let i = 0; i < filePaths.length; i++) {
      const file = filePaths[i];
      onProgress?.(file, i + 1, filePaths.length);
      await this.indexFile(file);
    }
  }
}
