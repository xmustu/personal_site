import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
import { Link } from "@/i18n/navigation";

const GITHUB_PROFILE_HREF = "https://github.com/xmustu";

export default async function ContactPage() {
  const t = await getTranslations("Contact");

  return (
    <main className="py-16">
      <div className="site-detail-shell">
        <section className="site-card site-detail-main flex flex-col gap-5">
          <p className="site-kicker">{t("detailKicker")}</p>
          <h1 className="site-title">{t("title")}</h1>
          <p className="site-body">{t("stub")}</p>
          <ContactForm />
          <Link className="mt-1 text-sm text-neutral-600 underline hover:text-orange-600" href="/">
            ←
          </Link>
        </section>
        <aside className="site-detail-aside">
          <div className="site-card-soft sticky top-24">
            <p className="site-kicker">{t("asideTitle")}</p>
            <nav className="mt-3 flex flex-col gap-2 text-sm">
              <Link className="text-neutral-800 underline-offset-2 hover:text-orange-600 hover:underline" href="/workflow">
                {t("linkWorkflow")}
              </Link>
              <Link className="text-neutral-800 underline-offset-2 hover:text-orange-600 hover:underline" href="/blog">
                {t("linkBlog")}
              </Link>
              <Link className="text-neutral-800 underline-offset-2 hover:text-orange-600 hover:underline" href="/projects">
                {t("linkProjects")}
              </Link>
              <a
                className="text-neutral-800 underline-offset-2 hover:text-orange-600 hover:underline"
                href={GITHUB_PROFILE_HREF}
                rel="noopener noreferrer"
                target="_blank"
              >
                {t("linkGithub")}
                <span aria-hidden="true" className="ml-0.5 text-xs">
                  ↗
                </span>
              </a>
            </nav>
            <p className="mt-4 text-xs leading-relaxed text-neutral-500">{t("asideNote")}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
