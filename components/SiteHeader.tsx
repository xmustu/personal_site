import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteHeader() {
  const t = await getTranslations("Nav");

  return (
    <header className="border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-6 px-6 py-4">
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <Link className="text-neutral-900 hover:text-neutral-600" href="/">
            {t("home")}
          </Link>
          <span className="text-neutral-300">/</span>
          <Link
            className="text-neutral-600 hover:text-neutral-900"
            href="/about"
          >
            {t("about")}
          </Link>
          <Link
            className="text-neutral-600 hover:text-neutral-900"
            href="/projects"
          >
            {t("projects")}
          </Link>
          <Link
            className="text-neutral-600 hover:text-neutral-900"
            href="/blog"
          >
            {t("blog")}
          </Link>
          <Link
            className="text-neutral-600 hover:text-neutral-900"
            href="/contact"
          >
            {t("contact")}
          </Link>
        </nav>
        <div className="flex shrink-0 items-center gap-3 text-sm">
          <Link className="text-neutral-600 hover:text-neutral-900" href="/" locale="zh">
            中文
          </Link>
          <span className="text-neutral-300">|</span>
          <Link className="text-neutral-600 hover:text-neutral-900" href="/" locale="en">
            EN
          </Link>
        </div>
      </div>
    </header>
  );
}
