import simpleGit from "simple-git";

const git = simpleGit();

export interface CommitInfo {
  hash: string;
  date: string;
  message: string;
  author_name: string;
}

export async function getRecentCommits(limit = 10): Promise<CommitInfo[]> {
  try {
    const log = await git.log({ maxCount: limit });
    return log.all.map((entry) => ({
      hash: entry.hash,
      date: entry.date,
      message: entry.message,
      author_name: entry.author_name,
    }));
  } catch {
    return [];
  }
}

export async function getDiffSummary(): Promise<string> {
  try {
    const diff = await git.diff(["HEAD~1", "HEAD"]);
    return diff || "No diff available";
  } catch {
    return "No git history available";
  }
}

export async function getChangedFiles(): Promise<string[]> {
  try {
    const status = await git.status();
    return [...status.modified, ...status.created, ...status.deleted];
  } catch {
    return [];
  }
}

export async function blameFile(filePath: string): Promise<string> {
  try {
    const blame = await git.raw(["log", "--oneline", "-5", "--", filePath]);
    return blame;
  } catch {
    return "No blame info available";
  }
}
