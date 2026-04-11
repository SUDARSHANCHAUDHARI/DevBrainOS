import axios from "axios";
import { OLLAMA_BASE_URL, MODELS } from "../../../config/models";

export async function generate(prompt: string): Promise<string> {
  try {
    const res = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
      model: MODELS.generate,
      prompt,
      stream: false,
    });
    return res.data.response as string;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`LLM generate failed: ${msg}. Is Ollama running? Run: ollama serve`);
  }
}

export async function embed(text: string): Promise<number[]> {
  try {
    const truncated = text.slice(0, 8000);
    const res = await axios.post(`${OLLAMA_BASE_URL}/api/embeddings`, {
      model: MODELS.embed,
      prompt: truncated,
    });
    return res.data.embedding as number[];
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Embedding failed: ${msg}. Run: ollama pull nomic-embed-text`);
  }
}
