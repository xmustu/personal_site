import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { PortableTextRenderer } from "@/components/portable/PortableTextRenderer";
import { isSanityConfigured } from "@/lib/sanity/client";
import { getProjectBySlug, getProjectSlugs } from "@/lib/sanity/queries";

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
    const slugs = await getProjectSlugs(PRE_RENDER_DETAIL_LIMIT);
    return routing.locales.flatMap((locale) =>
      slugs.map((project) => ({ locale, slug: project.slug })),
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
  const localizedPath =
    locale === "zh" ? `/projects/${slug}` : `/${locale}/projects/${slug}`;
  const canonicalUrl = `${normalizedSiteUrl}${localizedPath}`;

  if (!isSanityConfigured) {
    return {
      title: locale === "zh" ? "项目" : "Projects",
      description: locale === "zh" ? "项目详情页。" : "Project detail page.",
    };
  }

  const project = await getProjectBySlug(slug);
  if (!project) {
    return {
      title: locale === "zh" ? "项目" : "Projects",
      description: locale === "zh" ? "项目详情页。" : "Project detail page.",
    };
  }

  const description =
    project.summary ??
    (locale === "zh" ? "项目详情页。" : "Project detail page.");

  return {
    title: project.title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        zh: `${normalizedSiteUrl}/projects/${slug}`,
        en: `${normalizedSiteUrl}/en/projects/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      title: project.title,
      description,
      url: canonicalUrl,
      locale: locale === "zh" ? "zh_CN" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const t = await getTranslations("Projects");
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

  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
      {project.summary ? (
        <p className="text-neutral-700 leading-relaxed">{project.summary}</p>
      ) : null}
      {project.stack?.length ? (
        <p className="text-xs text-neutral-500">{project.stack.join(" / ")}</p>
      ) : null}
      <div className="flex gap-4 text-sm text-neutral-700">
        {project.repoUrl ? (
          <a className="underline" href={project.repoUrl} rel="noreferrer" target="_blank">
            GitHub
          </a>
        ) : null}
        {project.demoUrl ? (
          <a className="underline" href={project.demoUrl} rel="noreferrer" target="_blank">
            Demo
          </a>
        ) : null}
      </div>
      {project.body?.length ? (
        <article className="mt-2">
          <PortableTextRenderer value={project.body} />
        </article>
      ) : null}
      <Link className="text-sm text-neutral-600 underline" href="/projects">
        ←
      </Link>
    </main>
  );
}
