import { getTranslations } from "next-intl/server";
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

  return (
    <main className="site-shell py-16">
      <section className="site-card">
        <HeroDoodle className="mb-5 w-full" />
        <span className="mb-4 inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
          Personal Website
        </span>
        <h1 className="site-title">{title || t("title")}</h1>
        <p className="site-subtitle mt-3">{subtitle || t("subtitle")}</p>
        <p className="site-body mt-5">{body || t("body")}</p>
      </section>
    </main>
  );
}
