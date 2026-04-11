import fs from "fs";
import path from "path";
import { SCAN_EXTENSIONS, IGNORE_DIRS } from "../../config/models";

export function scanDir(dir: string, results: string[] = []): string[] {
  let entries: string[];

  try {
    entries = fs.readdirSync(dir);
  } catch {
    return results;
  }

  for (const entry of entries) {
    if (IGNORE_DIRS.includes(entry)) continue;

    const full = path.join(dir, entry);

    let stat: fs.Stats;
    try {
      stat = fs.statSync(full);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      scanDir(full, results);
    } else if (SCAN_EXTENSIONS.includes(path.extname(entry))) {
      results.push(full);
    }
  }

  return results;
}

export function readFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}
