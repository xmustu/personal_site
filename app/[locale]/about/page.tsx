import { getTranslations } from "next-intl/server";
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

  return (
    <main className="site-shell py-16">
      <section className="site-card flex flex-col gap-4">
        <HeroDoodle className="w-full" />
        <h1 className="site-title">{title || t("title")}</h1>
        <p className="site-body">{body || t("stub")}</p>
        <Link className="mt-2 text-sm text-neutral-600 underline hover:text-orange-600" href="/">
          ←
        </Link>
      </section>
    </main>
  );
}
