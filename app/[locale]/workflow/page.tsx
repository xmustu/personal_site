import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/content/MarkdownContent";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Workflow" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function WorkflowPage({ params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const lang = locale === "zh" ? "zh" : "en";
  const filePath = path.join(process.cwd(), "content", "workflow", `${lang}.md`);

  if (!existsSync(filePath)) {
    notFound();
  }

  const markdown = readFileSync(filePath, "utf8");
  const t = await getTranslations("Workflow");

  return (
    <main className="site-shell py-16">
      <article className="site-card">
        <p className="text-xs font-medium uppercase tracking-wide text-orange-700/90">
          {t("kicker")}
        </p>
        <h1 className="site-title mt-2">{t("title")}</h1>
        <p className="site-subtitle mt-2">{t("subtitle")}</p>
        <MarkdownContent className="mt-8 site-body" content={markdown} />
        <Link
          className="mt-8 inline-block text-sm text-neutral-600 underline hover:text-orange-600"
          href="/"
        >
          {t("backHome")}
        </Link>
      </article>
    </main>
  );
}
