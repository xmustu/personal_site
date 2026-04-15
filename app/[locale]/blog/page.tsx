import { getTranslations } from "next-intl/server";
import { HeroDoodle } from "@/components/illustration/HeroDoodle";
import { Link } from "@/i18n/navigation";
import { isSanityConfigured } from "@/lib/sanity/client";
import { getPostList } from "@/lib/sanity/queries";

export default async function BlogPage() {
  const t = await getTranslations("Blog");
  const posts = isSanityConfigured ? await getPostList() : [];

  return (
    <main className="site-shell py-16">
      <section className="site-card flex flex-col gap-4">
        <div className="-mx-1 mb-1 flex h-14 justify-center overflow-hidden rounded-xl bg-orange-50/40">
          <HeroDoodle className="w-[min(120%,640px)] max-w-none shrink-0 origin-top scale-[0.38] opacity-45 saturate-75" />
        </div>
        <h1 className="site-title">{t("title")}</h1>
        <p className="site-body">{t("stub")}</p>
        {!isSanityConfigured ? (
          <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {t("notConfigured")}
          </p>
        ) : null}

        {isSanityConfigured && posts.length > 0 ? (
          <ul className="mt-2 space-y-3">
            {posts.map((post) => (
              <li
                className="rounded-xl border px-4 py-3"
                key={post._id}
                style={{ borderColor: "var(--site-line)", backgroundColor: "#fffdf9" }}
              >
                <Link
                  className="font-medium text-neutral-900 underline-offset-2 hover:text-orange-600 hover:underline"
                  href={`/blog/${post.slug}`}
                >
                  {post.title}
                </Link>
                {post.excerpt ? (
                  <p className="mt-1 text-sm text-neutral-600">{post.excerpt}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}

        {isSanityConfigured && posts.length === 0 ? (
          <p className="text-sm text-neutral-600">{t("empty")}</p>
        ) : null}

        <Link className="mt-2 text-sm text-neutral-600 underline hover:text-orange-600" href="/">
          ←
        </Link>
      </section>
    </main>
  );
}
