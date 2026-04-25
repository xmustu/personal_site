import { fetchRepoMeta } from "@/lib/github/fetchRepoMeta";
import {
  githubOpenGraphImageUrl,
  parseGithubRepoUrl,
} from "@/lib/github/parseRepoUrl";
import type { ProjectListItem } from "@/lib/sanity/queries";

export type ProjectCardModel = ProjectListItem & {
  displayTitle: string;
  displaySummary?: string;
  displayStack?: string[];
  cardHref: string;
  cardExternal: boolean;
  coverUrl: string | null;
};

function buildCoverUrl(
  parsed: { owner: string; repo: string } | null,
  cardImageAssetUrl?: string | null,
  cardCoverUrl?: string | null,
): string | null {
  if (cardImageAssetUrl?.trim()) {
    return cardImageAssetUrl.trim();
  }
  if (cardCoverUrl?.trim()) {
    return cardCoverUrl.trim();
  }
  if (parsed) {
    return githubOpenGraphImageUrl(parsed.owner, parsed.repo);
  }
  return null;
}

export async function enrichProjectsForCards(
  projects: ProjectListItem[],
): Promise<ProjectCardModel[]> {
  return Promise.all(
    projects.map(async (p) => {
      const parsed = p.repoUrl ? parseGithubRepoUrl(p.repoUrl) : null;
      const meta = parsed ? await fetchRepoMeta(parsed.owner, parsed.repo) : null;

      const displayTitle =
        (p.title && p.title.trim()) ||
        meta?.full_name ||
        (parsed ? `${parsed.owner}/${parsed.repo}` : p.slug);

      const displaySummary =
        (p.summary && p.summary.trim()) ||
        (meta?.description?.trim() ? meta.description.trim() : undefined);

      let displayStack = p.stack?.filter(Boolean);
      if (!displayStack?.length && meta?.topics?.length) {
        displayStack = meta.topics.slice(0, 8);
      } else if (!displayStack?.length && meta?.language) {
        displayStack = [meta.language];
      }

      const cardExternal = Boolean(parsed && p.repoUrl);
      const cardHref =
        cardExternal && p.repoUrl
          ? meta?.html_url || p.repoUrl.trim()
          : `/projects/${p.slug}`;

      const coverUrl = buildCoverUrl(
        parsed,
        p.cardImageAssetUrl,
        p.cardCoverUrl,
      );

      return {
        ...p,
        displayTitle,
        displaySummary,
        displayStack,
        cardHref,
        cardExternal,
        coverUrl,
      };
    }),
  );
}
