import { parseTypeScriptFile } from "./astParser";
import path from "path";

export interface DependencyNode {
  file: string;
  imports: string[];
  classes: string[];
  functions: string[];
}

export function buildDependencyGraph(filePaths: string[]): Map<string, DependencyNode> {
  const graph = new Map<string, DependencyNode>();

  for (const filePath of filePaths) {
    const ext = path.extname(filePath);
    if (ext !== ".ts" && ext !== ".tsx") continue;

    try {
      const parsed = parseTypeScriptFile(filePath);
      graph.set(filePath, {
        file: filePath,
        imports: parsed.imports,
        classes: parsed.classes,
        functions: parsed.functions,
      });
    } catch {
      // skip unparseable files
    }
  }

  return graph;
}

export function graphToText(graph: Map<string, DependencyNode>): string {
  const lines: string[] = ["=== DEPENDENCY GRAPH ==="];

  for (const [file, node] of graph.entries()) {
    lines.push(`\n${file}`);
    if (node.classes.length > 0) lines.push(`  Classes: ${node.classes.join(", ")}`);
    if (node.functions.length > 0) lines.push(`  Functions: ${node.functions.join(", ")}`);
    if (node.imports.length > 0) lines.push(`  Imports: ${node.imports.join(", ")}`);
  }

  return lines.join("\n");
}
