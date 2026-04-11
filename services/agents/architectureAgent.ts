import { generate } from "../../apps/api/core/llm";
import { graphToText } from "../scanner/dependencyGraph";
import type { DependencyNode } from "../scanner/dependencyGraph";

export async function architectureAgent(graph: Map<string, DependencyNode>): Promise<string> {
  const graphText = graphToText(graph);

  return generate(`
You are a software architect analyzing a codebase structure.

Project dependency graph:
${graphText.slice(0, 5000)}

Analyze:

## Architecture Pattern
- What pattern is being used? (MVC, Clean Architecture, layered, etc.)
- Is it consistent across the codebase?

## Coupling Issues
- Which modules are too tightly coupled?
- Circular dependencies?

## Scalability
- What will break first as this project grows?

## Recommendations
- Top 3 architectural improvements with clear reasoning
`);
}
