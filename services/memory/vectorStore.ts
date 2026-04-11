import { db } from "./db";

interface MemoryRow {
  id: number;
  file_path: string;
  text: string;
  embedding: string;
  indexed_at: string;
}

interface SearchResult {
  file_path: string;
  text: string;
  score: number;
}

export class VectorStore {
  add(filePath: string, text: string, embedding: number[]): void {
    db.prepare(`
      DELETE FROM memory WHERE file_path = ?
    `).run(filePath);

    db.prepare(`
      INSERT INTO memory (file_path, text, embedding)
      VALUES (?, ?, ?)
    `).run(filePath, text, JSON.stringify(embedding));
  }

  getAll(): MemoryRow[] {
    return db.prepare(`SELECT * FROM memory`).all() as MemoryRow[];
  }

  count(): number {
    const row = db.prepare(`SELECT COUNT(*) as cnt FROM memory`).get() as { cnt: number };
    return row.cnt;
  }

  clear(): void {
    db.prepare(`DELETE FROM memory`).run();
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }

    const denom = Math.sqrt(magA) * Math.sqrt(magB);
    return denom === 0 ? 0 : dot / denom;
  }

  search(queryEmbedding: number[], topK = 5): SearchResult[] {
    const rows = this.getAll();

    return rows
      .map((row) => ({
        file_path: row.file_path,
        text: row.text,
        score: this.cosineSimilarity(queryEmbedding, JSON.parse(row.embedding) as number[]),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}
