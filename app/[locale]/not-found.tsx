import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFoundPage() {
  const t = await getTranslations("NotFound");

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-3 px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="text-neutral-700">{t("body")}</p>
      <Link className="text-sm text-neutral-600 underline" href="/">
        ← Home
      </Link>
    </main>
  );
}
