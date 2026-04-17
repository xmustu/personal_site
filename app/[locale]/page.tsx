import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/content/MarkdownContent";
import { HeroDoodle } from "@/components/illustration/HeroDoodle";
import { Link } from "@/i18n/navigation";
import { isSanityConfigured } from "@/lib/sanity/client";
import { getHomeContent, getRecentPosts, getRecentProjects } from "@/lib/sanity/queries";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

function formatPostDate(iso: string | undefined, locale: string) {
  if (!iso) {
    return "";
  }
  try {
    return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
      dateStyle: "medium",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations("Home");
  const homeContent = isSanityConfigured ? await getHomeContent() : null;
  const isZh = locale === "zh";

  const title = isZh ? homeContent?.titleZh : homeContent?.titleEn;
  const subtitle = isZh ? homeContent?.subtitleZh : homeContent?.subtitleEn;
  const body = isZh ? homeContent?.bodyZh : homeContent?.bodyEn;
  const bodyContent = body || t("body");

  const posts = isSanityConfigured ? await getRecentPosts(5) : [];
  const projects = isSanityConfigured ? await getRecentProjects(4) : [];

  return (
    <main className="site-shell space-y-10 py-16">
      <section className="site-card overflow-hidden">
        <div className="-mx-2 -mt-2 mb-6 rounded-2xl bg-orange-50/40 p-2">
          <HeroDoodle className="w-full" />
        </div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
            {t("pillWriting")}
          </span>
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-700 ring-1 ring-orange-100">
            {t("pillCuration")}
          </span>
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-700 ring-1 ring-orange-100">
            {t("pillStack")}
          </span>
        </div>
        <h1 className="site-title">{title || t("title")}</h1>
        <p className="site-subtitle mt-3">{subtitle || t("subtitle")}</p>
        <MarkdownContent className="mt-5 site-body" content={bodyContent} />
        <div className="mt-6 site-grid-two">
          <div className="site-card-soft">
            <p className="site-kicker">{isZh ? "内容节奏" : "Cadence"}</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              {isZh ? "每周一篇：技术写作 + 策展输出，持续更新可追踪。" : "One post per week: original writing plus curated insights, consistently shipped."}
            </p>
          </div>
          <div className="site-card-soft">
            <p className="site-kicker">{isZh ? "内容来源" : "Sources"}</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              {isZh ? "原创优先，外部材料仅入草稿，审稿后发布，保证可追溯。" : "Original-first. External sources enter draft-only workflow and are reviewed before publishing."}
            </p>
          </div>
        </div>
      </section>

      <section className="site-card">
        <p className="site-kicker">
          {t("pillarsKicker")}
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900">
          {t("pillarsTitle")}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-orange-50/40 p-4" style={{ borderColor: "var(--site-line)" }}>
            <h3 className="text-sm font-semibold text-neutral-900">{t("pillarWriteTitle")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{t("pillarWriteBody")}</p>
          </div>
          <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--site-line)" }}>
            <h3 className="text-sm font-semibold text-neutral-900">{t("pillarCurateTitle")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{t("pillarCurateBody")}</p>
          </div>
          <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--site-line)" }}>
            <h3 className="text-sm font-semibold text-neutral-900">{t("pillarShipTitle")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{t("pillarShipBody")}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="inline-flex items-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
            href="/workflow"
          >
            {t("ctaWorkflow")}
          </Link>
          <Link
            className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium text-neutral-800 hover:border-orange-300 hover:text-orange-700"
            href="/blog"
            style={{ borderColor: "var(--site-line)" }}
          >
            {t("ctaBlog")}
          </Link>
        </div>
      </section>

      <div className="site-grid-two">
        <section className="site-card flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-orange-700/90">
                {t("latestKicker")}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-neutral-900">{t("latestTitle")}</h2>
            </div>
            <Link className="shrink-0 text-sm text-orange-700 underline-offset-2 hover:underline" href="/blog">
              {t("latestSeeAll")}
            </Link>
          </div>
          {!isSanityConfigured ? (
            <p className="mt-4 text-sm text-neutral-600">{t("latestNotConfigured")}</p>
          ) : posts.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-600">{t("latestEmpty")}</p>
          ) : (
            <ul className="mt-5 flex flex-1 flex-col gap-3">
              {posts.map((post) => (
                <li key={post._id}>
                  <Link
                    className="group block rounded-xl border bg-white/80 px-4 py-3 transition hover:border-orange-200 hover:bg-orange-50/40"
                    href={`/blog/${post.slug}`}
                    style={{ borderColor: "var(--site-line)" }}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-medium text-neutral-900 group-hover:text-orange-700">
                        {post.title}
                      </span>
                      {post.publishedAt ? (
                        <time className="text-xs text-neutral-500" dateTime={post.publishedAt}>
                          {formatPostDate(post.publishedAt, locale)}
                        </time>
                      ) : null}
                    </div>
                    {post.excerpt ? (
                      <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{post.excerpt}</p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="site-card flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-orange-700/90">
                {t("projectsKicker")}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-neutral-900">{t("projectsTitle")}</h2>
            </div>
            <Link className="shrink-0 text-sm text-orange-700 underline-offset-2 hover:underline" href="/projects">
              {t("projectsSeeAll")}
            </Link>
          </div>
          {!isSanityConfigured ? (
            <p className="mt-4 text-sm text-neutral-600">{t("projectsNotConfigured")}</p>
          ) : projects.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-600">{t("projectsEmpty")}</p>
          ) : (
            <ul className="mt-5 flex flex-1 flex-col gap-3">
              {projects.map((project) => (
                <li key={project._id}>
                  <Link
                    className="group block rounded-xl border bg-white/80 px-4 py-3 transition hover:border-orange-200 hover:bg-orange-50/40"
                    href={`/projects/${project.slug}`}
                    style={{ borderColor: "var(--site-line)" }}
                  >
                    <span className="font-medium text-neutral-900 group-hover:text-orange-700">
                      {project.title}
                    </span>
                    {project.summary ? (
                      <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{project.summary}</p>
                    ) : null}
                    {project.stack && project.stack.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {project.stack.slice(0, 5).map((tag) => (
                          <span
                            className="rounded-full bg-orange-100/80 px-2 py-0.5 text-[11px] font-medium text-orange-800"
                            key={tag}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="site-card">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="site-kicker">{isZh ? "精选项目" : "Featured projects"}</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900">
              {isZh ? "代表性案例" : "Selected case studies"}
            </h2>
          </div>
          <Link className="text-sm text-orange-700 underline-offset-2 hover:underline" href="/projects">
            {t("projectsSeeAll")}
          </Link>
        </div>
        {projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {projects.slice(0, 3).map((project, index) => (
              <Link
                className={`site-lift rounded-2xl border p-4 ${index === 0 ? "md:col-span-2" : ""}`}
                href={`/projects/${project.slug}`}
                key={project._id}
                style={{ borderColor: "var(--site-line)", backgroundColor: "#fffdf9" }}
              >
                <p className="text-base font-semibold text-neutral-900">{project.title}</p>
                {project.summary ? (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600">{project.summary}</p>
                ) : null}
                {project.stack?.length ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 6).map((tag) => (
                      <span
                        className="rounded-full bg-orange-100/80 px-2 py-0.5 text-[11px] font-medium text-orange-800"
                        key={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-600">{t("projectsEmpty")}</p>
        )}
      </section>
    </main>
  );
}
