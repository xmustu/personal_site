import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GiscusComments } from "@/components/blog/GiscusComments";
import { Link } from "@/i18n/navigation";
import { PortableTextRenderer } from "@/components/portable/PortableTextRenderer";
import { isSanityConfigured } from "@/lib/sanity/client";
import { getPostBySlug } from "@/lib/sanity/queries";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

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
  const { slug } = await params;

  if (!isSanityConfigured) {
    return (
      <main className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {t("notConfigured")}
        </p>
      </main>
    );
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
      {post.publishedAt ? (
        <p className="text-sm text-neutral-500">
          {new Date(post.publishedAt).toLocaleDateString()}
        </p>
      ) : null}
      {post.excerpt ? (
        <p className="text-neutral-700 leading-relaxed">{post.excerpt}</p>
      ) : null}
      {post.body?.length ? (
        <article className="mt-2">
          <PortableTextRenderer value={post.body} />
        </article>
      ) : null}
      <section className="mt-8 border-t border-neutral-200 pt-6">
        <h2 className="text-xl font-semibold tracking-tight">{t("commentsTitle")}</h2>
        <div className="mt-4">
          <GiscusComments />
        </div>
      </section>
      <Link className="text-sm text-neutral-600 underline" href="/blog">
        ←
      </Link>
    </main>
  );
}
