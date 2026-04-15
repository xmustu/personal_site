import { getTranslations } from "next-intl/server";
import { HeroDoodle } from "@/components/illustration/HeroDoodle";
import { Link } from "@/i18n/navigation";

export default async function AboutPage() {
  const t = await getTranslations("About");

  return (
    <main className="site-shell py-16">
      <section className="site-card flex flex-col gap-4">
        <HeroDoodle className="w-full" />
        <h1 className="site-title">{t("title")}</h1>
        <p className="site-body">{t("stub")}</p>
        <Link className="mt-2 text-sm text-neutral-600 underline hover:text-orange-600" href="/">
          ←
        </Link>
      </section>
    </main>
  );
}
