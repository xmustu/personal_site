import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { HeroDoodle } from "@/components/illustration/HeroDoodle";
import { Link } from "@/i18n/navigation";
import { isSanityConfigured } from "@/lib/sanity/client";
import { getPostList } from "@/lib/sanity/queries";
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

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations("Blog");
  const posts = isSanityConfigured ? await getPostList() : [];
  const rssHref = locale === routing.defaultLocale ? "/blog/rss" : `/${locale}/blog/rss`;

  return (
    <main className="site-shell py-16">
      <section className="site-card flex flex-col gap-6">
        <div className="-mx-1 flex h-14 justify-center overflow-hidden rounded-xl bg-orange-50/40">
          <HeroDoodle className="w-[min(120%,640px)] max-w-none shrink-0 origin-top scale-[0.38] opacity-45 saturate-75" />
        </div>
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

        {isSanityConfigured && posts.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {posts.map((post) => (
              <li key={post._id}>
                <Link
                  className="group flex h-full flex-col rounded-2xl border bg-white/90 p-5 transition hover:border-orange-200 hover:bg-orange-50/50"
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
                  <span className="mt-4 text-sm font-medium text-orange-700/90 group-hover:underline">
                    {t("readPost")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        {isSanityConfigured && posts.length === 0 ? (
          <p className="text-sm text-neutral-600">{t("empty")}</p>
        ) : null}

        <Link className="text-sm text-neutral-600 underline hover:text-orange-600" href="/">
          ←
        </Link>
      </section>
    </main>
  );
}
