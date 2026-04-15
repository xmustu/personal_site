import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("Home");

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="text-lg text-neutral-600">{t("subtitle")}</p>
      <p className="text-neutral-700 leading-relaxed">{t("body")}</p>
    </main>
  );
}
