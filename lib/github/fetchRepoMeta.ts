export type GithubRepoMeta = {
  full_name: string;
  description: string | null;
  html_url: string;
  topics?: string[];
  language: string | null;
  stargazers_count: number;
};

export async function fetchRepoMeta(
  owner: string,
  repo: string,
): Promise<GithubRepoMeta | null> {
  const token = process.env.GITHUB_TOKEN?.trim();
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "personal-site",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return null;
  }

  try {
    const data = (await res.json()) as Record<string, unknown>;
    const full_name = typeof data.full_name === "string" ? data.full_name : `${owner}/${repo}`;
    const html_url = typeof data.html_url === "string" ? data.html_url : `https://github.com/${owner}/${repo}`;
    const description = typeof data.description === "string" ? data.description : null;
    const language = typeof data.language === "string" ? data.language : null;
    const stargazers_count =
      typeof data.stargazers_count === "number" ? data.stargazers_count : 0;
    const topics = Array.isArray(data.topics)
      ? data.topics.filter((t): t is string => typeof t === "string")
      : [];

    return {
      full_name,
      description,
      html_url,
      topics,
      language,
      stargazers_count,
    };
  } catch {
    return null;
  }
}
