import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { HeroDoodle } from "@/components/illustration/HeroDoodle";
import { Link } from "@/i18n/navigation";
import { isSanityConfigured } from "@/lib/sanity/client";
import { getPostList } from "@/lib/sanity/queries";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string }>;
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

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { tag } = await searchParams;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations("Blog");
  const posts = isSanityConfigured ? await getPostList() : [];
  const rssHref = locale === routing.defaultLocale ? "/blog/rss" : `/${locale}/blog/rss`;
  const activeTag = (tag ?? "").trim();
  const allTags = [...new Set(posts.flatMap((post) => post.categories ?? []).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, locale === "zh" ? "zh-CN" : "en-US"),
  );
  const filteredPosts =
    activeTag.length > 0
      ? posts.filter((post) => (post.categories ?? []).includes(activeTag))
      : posts;
  const blogBasePath = locale === routing.defaultLocale ? "/blog" : `/${locale}/blog`;

  return (
    <main className="site-shell py-16">
      <section className="site-card flex flex-col gap-6">
        <div className="-mx-1 flex h-14 justify-center overflow-hidden rounded-xl bg-orange-50/40">
          <HeroDoodle className="w-[min(120%,640px)] max-w-none shrink-0 origin-top scale-[0.38] opacity-45 saturate-75" />
        </div>
        <p className="site-kicker">Writing</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-orange-700/90">
              {t("listKicker")}
            </p>
            <h1 className="site-title mt-1">{t("title")}</h1>
            <p className="site-body mt-2 max-w-2xl">{t("stub")}</p>
          </div>
          <a
            className="inline-flex shrink-0 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium text-neutral-800 hover:border-orange-300 hover:text-orange-700"
            href={rssHref}
            style={{ borderColor: "var(--site-line)" }}
          >
            {t("rssSubscribe")}
          </a>
        </div>
        {!isSanityConfigured ? (
          <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {t("notConfigured")}
          </p>
        ) : null}

        {allTags.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <Link
              className={`rounded-full border px-3 py-1 text-xs ${activeTag ? "text-neutral-600 hover:text-orange-700" : "border-orange-200 bg-orange-100 text-orange-800"}`}
              href={blogBasePath}
              style={{ borderColor: activeTag ? "var(--site-line)" : undefined }}
            >
              {t("allTags")}
            </Link>
            {allTags.map((item) => (
              <Link
                className={`rounded-full border px-3 py-1 text-xs ${
                  activeTag === item
                    ? "border-orange-200 bg-orange-100 text-orange-800"
                    : "text-neutral-600 hover:border-orange-200 hover:text-orange-700"
                }`}
                href={`${blogBasePath}?tag=${encodeURIComponent(item)}`}
                key={item}
                style={{
                  borderColor: activeTag === item ? undefined : "var(--site-line)",
                }}
              >
                {item}
              </Link>
            ))}
          </div>
        ) : null}

        {isSanityConfigured && filteredPosts.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {filteredPosts.map((post) => (
              <li key={post._id}>
                <Link
                  className="site-lift group flex h-full flex-col rounded-2xl border bg-white/90 p-5 hover:border-orange-200 hover:bg-orange-50/50"
                  href={`/blog/${post.slug}`}
                  style={{ borderColor: "var(--site-line)" }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-base font-semibold text-neutral-900 group-hover:text-orange-700">
                      {post.title}
                    </span>
                    {post.publishedAt ? (
                      <time className="text-xs text-neutral-500" dateTime={post.publishedAt}>
                        {formatPostDate(post.publishedAt, locale)}
                      </time>
                    ) : null}
                  </div>
                  {post.excerpt ? (
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600">
                      {post.excerpt}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-neutral-400">{t("noExcerpt")}</p>
                  )}
                  {post.categories?.length ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {post.categories.slice(0, 4).map((cat) => (
                        <span className="rounded-full bg-orange-100/70 px-2 py-0.5 text-[11px] font-medium text-orange-800" key={cat}>
                          {cat}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <span className="mt-4 text-sm font-medium text-orange-700/90 group-hover:underline">
                    {t("readPost")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        {isSanityConfigured && filteredPosts.length === 0 ? (
          <p className="text-sm text-neutral-600">
            {activeTag ? t("emptyByTag", { tag: activeTag }) : t("empty")}
          </p>
        ) : null}

        <Link className="text-sm text-neutral-600 underline hover:text-orange-600" href="/">
          ←
        </Link>
      </section>
    </main>
  );
}
