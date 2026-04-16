import { getTranslations } from "next-intl/server";
import { MarkdownContent } from "@/components/content/MarkdownContent";
import { HeroDoodle } from "@/components/illustration/HeroDoodle";
import { isSanityConfigured } from "@/lib/sanity/client";
import { getHomeContent } from "@/lib/sanity/queries";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("Home");
  const homeContent = isSanityConfigured ? await getHomeContent() : null;
  const isZh = locale === "zh";

  const title = isZh ? homeContent?.titleZh : homeContent?.titleEn;
  const subtitle = isZh ? homeContent?.subtitleZh : homeContent?.subtitleEn;
  const body = isZh ? homeContent?.bodyZh : homeContent?.bodyEn;
  const bodyContent = body || t("body");

  return (
    <main className="site-shell py-16">
      <section className="site-card overflow-hidden">
        <HeroDoodle className="mb-5 w-full" />
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
            Personal Website
          </span>
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-600 ring-1 ring-orange-100">
            AI LLM
          </span>
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-600 ring-1 ring-orange-100">
            Industrial Design
          </span>
        </div>
        <h1 className="site-title">{title || t("title")}</h1>
        <p className="site-subtitle mt-3">{subtitle || t("subtitle")}</p>
        <MarkdownContent className="mt-5 site-body" content={bodyContent} />
      </section>
    </main>
  );
}
