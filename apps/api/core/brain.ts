import { embed, generate } from "./llm";
import { VectorStore } from "../../../services/memory/vectorStore";

export class DevBrain {
  constructor(private store: VectorStore) {}

  async ask(question: string): Promise<string> {
    const queryEmbedding = await embed(question);
    const results = this.store.search(queryEmbedding, 5);

    if (results.length === 0) {
      return "No codebase indexed yet. Run: npm run scan -- /path/to/your/project";
    }

    const context = results
      .map((r, i) => `[Source ${i + 1}: ${r.file_path}]\n${r.text}`)
      .join("\n\n---\n\n");

    const prompt = `
You are a senior software engineer with deep knowledge of this specific codebase.

PROJECT CONTEXT (most relevant files):
${context}

QUESTION: ${question}

Answer with:
- Direct answer to the question
- Relevant code references (file paths if applicable)
- Potential issues or caveats
- Concrete suggestions if improvements are asked

Be specific to THIS codebase, not generic.
`;

    return generate(prompt);
  }

  async summarize(): Promise<string> {
    const all = this.store.getAll();
    if (all.length === 0) return "No codebase indexed.";

    const sample = all.slice(0, 10).map((r) => r.text.slice(0, 300)).join("\n\n");

    return generate(`
Summarize this codebase in 3-5 sentences. What does it do? What are the main components?

Context:
${sample}
`);
  }
}
