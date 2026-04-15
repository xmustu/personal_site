import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function AboutPage() {
  const t = await getTranslations("About");

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="text-neutral-700 leading-relaxed">{t("stub")}</p>
      <Link className="text-sm text-neutral-600 underline" href="/">
        ←
      </Link>
    </main>
  );
}
