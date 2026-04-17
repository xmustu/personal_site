import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GiscusComments } from "@/components/blog/GiscusComments";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  extractTocHeadings,
  PortableTextRenderer,
} from "@/components/portable/PortableTextRenderer";
import { isSanityConfigured } from "@/lib/sanity/client";
import { getPostBySlug, getPostSlugs } from "@/lib/sanity/queries";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const PRE_RENDER_DETAIL_LIMIT = 20;

export const dynamicParams = true;

export async function generateStaticParams() {
  if (!isSanityConfigured) {
    return [];
  }

  try {
    const slugs = await getPostSlugs(PRE_RENDER_DETAIL_LIMIT);
    return routing.locales.flatMap((locale) =>
      slugs.map((post) => ({ locale, slug: post.slug })),
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const normalizedSiteUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
  const localizedPath = locale === "zh" ? `/blog/${slug}` : `/${locale}/blog/${slug}`;
  const canonicalUrl = `${normalizedSiteUrl}${localizedPath}`;

  if (!isSanityConfigured) {
    return {
      title: locale === "zh" ? "博客" : "Blog",
      description: locale === "zh" ? "技术文章详情页。" : "Blog post detail page.",
    };
  }

  const post = await getPostBySlug(slug);
  if (!post) {
    return {
      title: locale === "zh" ? "博客" : "Blog",
      description: locale === "zh" ? "技术文章详情页。" : "Blog post detail page.",
    };
  }

  const description =
    post.excerpt ??
    (locale === "zh" ? "技术文章详情页。" : "Blog post detail page.");

  return {
    title: post.title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        zh: `${normalizedSiteUrl}/blog/${slug}`,
        en: `${normalizedSiteUrl}/en/blog/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: canonicalUrl,
      locale: locale === "zh" ? "zh_CN" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const t = await getTranslations("Blog");
  const { locale, slug } = await params;

  if (!isSanityConfigured) {
    return (
      <main className="site-shell py-16">
        <section className="site-card flex flex-col gap-4">
          <h1 className="site-title">{t("title")}</h1>
          <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {t("notConfigured")}
          </p>
        </section>
      </main>
    );
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const tocHeadings = post.body?.length ? extractTocHeadings(post.body) : [];
  const blogPath = locale === "zh" ? "/blog" : `/${locale}/blog`;

  return (
    <main className="py-16">
      <ReadingProgressBar />
      <div className="site-detail-shell">
        <section className="site-card site-detail-main flex flex-col gap-5">
          <p className="site-kicker">{t("detailKicker")}</p>
          <h1 className="site-title">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            {post.publishedAt ? (
              <time dateTime={post.publishedAt}>
                {t("publishedOn")} {new Date(post.publishedAt).toLocaleDateString()}
              </time>
            ) : null}
            <span className="text-neutral-300">•</span>
            <span>{t("readingMode")}</span>
          </div>
          {post.excerpt ? (
            <div className="rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
              <p className="site-body">{post.excerpt}</p>
            </div>
          ) : null}
          {post.body?.length ? (
            <article className="mt-2">
              <PortableTextRenderer
                copiedLabel={t("copied")}
                copyLabel={t("copyCode")}
                value={post.body}
              />
            </article>
          ) : null}
          <section
            className="mt-4 rounded-xl border p-4"
            style={{ borderColor: "var(--site-line)", backgroundColor: "#fffdf9" }}
          >
            <h2 className="text-xl font-semibold tracking-tight">{t("commentsTitle")}</h2>
            <div className="mt-4">
              <GiscusComments />
            </div>
          </section>
          <Link className="mt-2 text-sm text-neutral-600 underline hover:text-orange-600" href={blogPath}>
            ←
          </Link>
        </section>
        <aside className="site-detail-aside">
          {tocHeadings.length > 0 ? (
            <div className="site-toc sticky top-24">
              <p className="site-toc-title">{t("tocTitle")}</p>
              <ul className="site-toc-list">
                {tocHeadings.map((heading) => (
                  <li className={heading.level === 3 ? "site-toc-subitem" : ""} key={heading.id}>
                    <a className="site-toc-link" href={`#${heading.id}`}>
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
