import { generate } from "../../apps/api/core/llm";

export async function codeAgent(context: string): Promise<string> {
  return generate(`
You are a senior software engineer performing a code review.

Codebase context:
${context.slice(0, 6000)}

Analyze the code above and return:

## Bugs
- List specific bugs you find (with file references if possible)
- If none, say "No obvious bugs found"

## Code Smells
- Anti-patterns, duplication, complexity issues

## Improvements
- Concrete suggestions to improve quality, readability, performance

Be specific. Reference actual code patterns you see.
`);
}
