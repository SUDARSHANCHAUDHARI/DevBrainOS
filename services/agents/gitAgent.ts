import { generate } from "../../apps/api/core/llm";
import { getRecentCommits, getDiffSummary } from "../git/gitAnalyzer";

export async function gitAgent(): Promise<string> {
  const commits = await getRecentCommits();
  const diff = await getDiffSummary();

  const commitText = commits
    .map((c) => `${c.hash.slice(0, 7)} | ${c.date.slice(0, 10)} | ${c.message}`)
    .join("\n");

  return generate(`
You are a git history analyst.

Recent commits:
${commitText}

Recent changes:
${diff.slice(0, 3000)}

Analyze:

## Commit Quality
- Are commit messages clear and descriptive?
- Are changes atomic (one concern per commit)?

## Risk Assessment
- Which recent changes are most likely to introduce bugs?
- Are there large untested changes?

## Suggestions
- What should be done before the next release?
`);
}
