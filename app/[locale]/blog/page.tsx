import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { isSanityConfigured } from "@/lib/sanity/client";
import { getPostList } from "@/lib/sanity/queries";

export default async function BlogPage() {
  const t = await getTranslations("Blog");
  const posts = isSanityConfigured ? await getPostList() : [];

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="text-neutral-700 leading-relaxed">{t("stub")}</p>
      {!isSanityConfigured ? (
        <p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {t("notConfigured")}
        </p>
      ) : null}

      {isSanityConfigured && posts.length > 0 ? (
        <ul className="mt-2 space-y-3">
          {posts.map((post) => (
            <li
              className="rounded-lg border border-neutral-200 bg-white px-4 py-3"
              key={post._id}
            >
              <Link
                className="font-medium text-neutral-900 underline-offset-2 hover:underline"
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

      <Link className="text-sm text-neutral-600 underline" href="/">
        ←
      </Link>
    </main>
  );
}
