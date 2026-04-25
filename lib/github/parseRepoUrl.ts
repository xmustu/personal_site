/**
 * 从 GitHub 仓库页 URL 解析 owner / repo（支持 .git、子路径、www）。
 */
export function parseGithubRepoUrl(input: string | undefined | null): {
  owner: string;
  repo: string;
} | null {
  if (!input?.trim()) {
    return null;
  }
  try {
    const u = new URL(input.trim());
    const host = u.hostname.replace(/^www\./i, "");
    if (!/^github\.com$/i.test(host)) {
      return null;
    }
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length < 2) {
      return null;
    }
    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/i, "");
    if (!/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(repo)) {
      return null;
    }
    return { owner, repo };
  } catch {
    return null;
  }
}

/** GitHub 为仓库生成的 Open Graph 预览图（可用作卡片背景）。 */
export function githubOpenGraphImageUrl(owner: string, repo: string): string {
  return `https://opengraph.githubassets.com/1/${owner}/${repo}`;
}
