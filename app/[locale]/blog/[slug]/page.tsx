import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { isSanityConfigured } from "@/lib/sanity/client";
import { getPostBySlug } from "@/lib/sanity/queries";

type Props = {
  params: Promise<{ slug: string }>;
};

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
      <p className="text-sm text-neutral-500">
        Body rendering will be wired next (Portable Text).
      </p>
      <Link className="text-sm text-neutral-600 underline" href="/blog">
        ←
      </Link>
    </main>
  );
}
