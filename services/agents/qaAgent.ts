import { generate } from "../../apps/api/core/llm";

export async function qaAgent(context: string): Promise<string> {
  return generate(`
You are a QA engineer generating adversarial test cases.

Code to test:
${context.slice(0, 6000)}

Generate:

## Edge Cases
- Boundary conditions (empty inputs, max values, negative numbers)
- Unexpected data types
- Concurrent access scenarios

## Test Scenarios
- Happy path
- Failure path
- Timeout / network failures (if async code exists)

## Missing Test Coverage
- Functions that have no obvious tests
- Logic branches not covered

Format as a checklist a developer can follow.
`);
}
