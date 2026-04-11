import { generate } from "../../apps/api/core/llm";

export async function debugAgent(context: string): Promise<string> {
  return generate(`
You are an expert debugger analyzing a codebase for potential runtime issues.

Code context:
${context.slice(0, 6000)}

Find and report:

## Null / Undefined Risks
- Where can null/undefined cause crashes?

## Unhandled Errors
- Missing try/catch, unhandled promise rejections

## Race Conditions
- Async code that may execute in wrong order

## Memory Leaks
- Event listeners not cleaned up, closures holding references

## Type Safety Issues
- Places where TypeScript types are bypassed (any, as casts, non-null assertions)

Rate overall risk: LOW / MEDIUM / HIGH
`);
}
