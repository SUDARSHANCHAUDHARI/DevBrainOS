import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "devbrain.db");

export const db: Database.Database = new Database(DB_PATH);

db.pragma("journal_mode = WAL");

db.prepare(`
  CREATE TABLE IF NOT EXISTS memory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_path TEXT NOT NULL,
    text TEXT NOT NULL,
    embedding TEXT NOT NULL,
    indexed_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`).run();

db.prepare(`
  CREATE INDEX IF NOT EXISTS idx_file_path ON memory(file_path)
`).run();
