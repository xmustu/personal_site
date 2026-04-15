import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ContactForm } from "@/components/contact/ContactForm";

export default async function ContactPage() {
  const t = await getTranslations("Contact");

  return (
    <main className="site-shell py-16">
      <section className="site-card flex flex-col gap-4">
        <h1 className="site-title">{t("title")}</h1>
        <p className="site-body">{t("stub")}</p>
        <ContactForm />
        <Link className="mt-2 text-sm text-neutral-600 underline hover:text-orange-600" href="/">
          ←
        </Link>
      </section>
    </main>
  );
}
