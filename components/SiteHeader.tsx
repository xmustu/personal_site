import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteHeader() {
  const t = await getTranslations("Nav");

  return (
    <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
      <div
        className="site-shell flex items-center justify-between gap-6 py-4"
        style={{ borderColor: "var(--site-line)" }}
      >
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <Link className="font-medium text-neutral-900 hover:text-orange-600" href="/">
            {t("home")}
          </Link>
          <span className="text-neutral-300">/</span>
          <Link
            className="text-neutral-600 hover:text-orange-600"
            href="/about"
          >
            {t("about")}
          </Link>
          <Link
            className="text-neutral-600 hover:text-orange-600"
            href="/projects"
          >
            {t("projects")}
          </Link>
          <Link
            className="text-neutral-600 hover:text-orange-600"
            href="/blog"
          >
            {t("blog")}
          </Link>
          <Link
            className="text-neutral-600 hover:text-orange-600"
            href="/workflow"
          >
            {t("workflow")}
          </Link>
          <Link
            className="text-neutral-600 hover:text-orange-600"
            href="/contact"
          >
            {t("contact")}
          </Link>
          <a
            className="inline-flex items-center gap-1 text-neutral-600 hover:text-orange-600"
            href="https://github.com/xmustu"
            rel="noreferrer"
            target="_blank"
          >
            {t("github")}
            <span aria-hidden="true" className="text-xs">
              ↗
            </span>
          </a>
        </nav>
        <div className="flex shrink-0 items-center gap-3 text-sm">
          <Link className="text-neutral-600 hover:text-orange-600" href="/" locale="zh">
            中文
          </Link>
          <span className="text-neutral-300">|</span>
          <Link className="text-neutral-600 hover:text-orange-600" href="/" locale="en">
            EN
          </Link>
        </div>
      </div>
    </header>
  );
}
