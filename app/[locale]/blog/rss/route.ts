import { getPostList } from "@/lib/sanity/queries";
import { isSanityConfigured } from "@/lib/sanity/client";
import { routing } from "@/i18n/routing";

function escapeXml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function getBaseUrl() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").trim();
  return siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
}

export const revalidate = 3600;

export async function GET(
  _request: Request,
  context: { params: Promise<{ locale: string }> },
) {
  const { locale } = await context.params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return new Response("Not found", { status: 404 });
  }

  const baseUrl = getBaseUrl();
  const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const channelTitle =
    locale === "zh" ? "个人网站 — 博客" : "Personal site — Blog";
  const channelLink = `${baseUrl}${localePrefix}/blog`;

  let posts: Awaited<ReturnType<typeof getPostList>> = [];
  if (isSanityConfigured) {
    try {
      posts = await getPostList();
    } catch {
      posts = [];
    }
  }

  const items = posts.slice(0, 50).map((post) => {
    const url = `${baseUrl}${localePrefix}/blog/${post.slug}`;
    const pubDate = post.publishedAt
      ? new Date(post.publishedAt).toUTCString()
      : new Date().toUTCString();
    const description = post.excerpt ? `<description>${escapeXml(post.excerpt)}</description>` : "";
    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      ${description}
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${escapeXml(channelLink)}</link>
    <description>${escapeXml(channelTitle)}</description>
    <language>${locale === "zh" ? "zh-cn" : "en-us"}</language>
    ${items.join("\n")}
  </channel>
</rss>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
