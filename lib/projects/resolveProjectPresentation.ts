import { fetchRepoMeta } from "@/lib/github/fetchRepoMeta";
import { parseGithubRepoUrl } from "@/lib/github/parseRepoUrl";

export type ResolvedProjectLead = {
  title: string;
  description: string;
};

/** 详情页与 SEO：标题/摘要为空时从 GitHub API 补全（单次请求）。 */
export async function resolveProjectPresentation(
  project: {
    title?: string | null;
    summary?: string | null;
    repoUrl?: string | null;
    slug: string;
  },
  emptyDescription: string,
): Promise<ResolvedProjectLead> {
  const summary = project.summary?.trim();
  const title = project.title?.trim();
  const parsed = project.repoUrl ? parseGithubRepoUrl(project.repoUrl) : null;
  const meta = parsed ? await fetchRepoMeta(parsed.owner, parsed.repo) : null;

  const resolvedTitle =
    title || meta?.full_name || (parsed ? `${parsed.owner}/${parsed.repo}` : project.slug);

  const resolvedDescription =
    summary ||
    (meta?.description?.trim() ? meta.description.trim() : null) ||
    emptyDescription;

  return { title: resolvedTitle, description: resolvedDescription };
}
