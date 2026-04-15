import { getTranslations } from "next-intl/server";
import { HeroDoodle } from "@/components/illustration/HeroDoodle";

export default async function HomePage() {
  const t = await getTranslations("Home");

  return (
    <main className="site-shell py-16">
      <section className="site-card">
        <HeroDoodle className="mb-5 w-full" />
        <span className="mb-4 inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
          Personal Website
        </span>
        <h1 className="site-title">{t("title")}</h1>
        <p className="site-subtitle mt-3">{t("subtitle")}</p>
        <p className="site-body mt-5">{t("body")}</p>
      </section>
    </main>
  );
}
