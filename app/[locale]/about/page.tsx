import { getTranslations } from "next-intl/server";
import { MarkdownContent } from "@/components/content/MarkdownContent";
import { HeroDoodle } from "@/components/illustration/HeroDoodle";
import { Link } from "@/i18n/navigation";
import { isSanityConfigured } from "@/lib/sanity/client";
import { getAboutContent } from "@/lib/sanity/queries";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("About");
  const aboutContent = isSanityConfigured ? await getAboutContent() : null;
  const isZh = locale === "zh";

  const title = isZh ? aboutContent?.titleZh : aboutContent?.titleEn;
  const body = isZh ? aboutContent?.bodyZh : aboutContent?.bodyEn;
  const bodyContent = body || t("stub");

  return (
    <main className="site-shell py-16">
      <section className="site-card flex flex-col gap-4">
        <HeroDoodle className="w-full" />
        <h1 className="site-title">{title || t("title")}</h1>
        <div className="rounded-xl border border-orange-100 bg-orange-50/50 px-4 py-3 text-sm text-orange-700">
          {isZh ? "核心方向：大模型应用工程与工业设计智能化落地" : "Focus: LLM application engineering for intelligent industrial design workflows"}
        </div>
        <MarkdownContent className="site-body" content={bodyContent} />
        <Link className="mt-2 text-sm text-neutral-600 underline hover:text-orange-600" href="/">
          ←
        </Link>
      </section>
    </main>
  );
}
