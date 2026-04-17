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

  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const backPath = locale === "zh" ? "/projects" : `/${locale}/projects`;

  return (
    <main className="py-16">
      <div className="site-detail-shell">
        <section className="site-card site-detail-main flex flex-col gap-5">
          <p className="site-kicker">{t("detailKicker")}</p>
          <h1 className="site-title">{project.title}</h1>
          {project.summary ? (
            <div className="rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
              <p className="site-body">{project.summary}</p>
            </div>
          ) : null}
          {project.stack?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((tag) => (
                <span
                  className="rounded-full bg-orange-100/80 px-2 py-0.5 text-[11px] font-medium text-orange-800"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          {project.body?.length ? (
            <article className="mt-2">
              <PortableTextRenderer copiedLabel="Copied" copyLabel="Copy code" value={project.body} />
            </article>
          ) : null}
          <Link className="mt-2 text-sm text-neutral-600 underline hover:text-orange-600" href={backPath}>
            ←
          </Link>
        </section>
        <aside className="site-detail-aside">
          <div className="site-card-soft sticky top-24">
            <p className="site-kicker">{t("quickLinks")}</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              {project.repoUrl ? (
                <a className="underline hover:text-orange-600" href={project.repoUrl} rel="noreferrer" target="_blank">
                  GitHub
                </a>
              ) : null}
              {project.demoUrl ? (
                <a className="underline hover:text-orange-600" href={project.demoUrl} rel="noreferrer" target="_blank">
                  Demo
                </a>
              ) : null}
              {!project.repoUrl && !project.demoUrl ? (
                <p className="text-neutral-500">{t("linksEmpty")}</p>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
