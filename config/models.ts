export const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";

export const MODELS = {
  generate: "qwen2.5-coder:7b",
  embed: "nomic-embed-text",
} as const;

export const SCAN_EXTENSIONS = [".ts", ".js", ".tsx", ".jsx", ".py", ".go", ".java", ".kt", ".swift"];

export const IGNORE_DIRS = ["node_modules", ".git", "dist", "build", ".next", "__pycache__", ".cache"];
