import { getTranslations } from "next-intl/server";
import { HeroDoodle } from "@/components/illustration/HeroDoodle";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Link } from "@/i18n/navigation";
import { enrichProjectsForCards } from "@/lib/projects/enrichProjectCards";
import { isSanityConfigured } from "@/lib/sanity/client";
import { getProjectList } from "@/lib/sanity/queries";

export default async function ProjectsPage() {
  const t = await getTranslations("Projects");
  const raw = isSanityConfigured ? await getProjectList() : [];
  const projects = raw.length ? await enrichProjectsForCards(raw) : [];

  return (
    <main className="site-shell py-16">
      <section className="site-card flex flex-col gap-6">
        <div className="-mx-1 mb-1 flex h-14 justify-center overflow-hidden rounded-xl bg-orange-50/40">
          <HeroDoodle className="w-[min(120%,640px)] max-w-none shrink-0 origin-top scale-[0.38] opacity-45 saturate-75" />
        </div>
        <p className="site-kicker">Portfolio</p>
        <h1 className="site-title">{t("title")}</h1>
        <p className="site-body">{t("stub")}</p>
        {!isSanityConfigured ? (
          <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {t("notConfigured")}
          </p>
        ) : null}

        {isSanityConfigured && projects.length > 0 ? (
          <ul className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <li key={project._id}>
                <ProjectCard project={project} variant="poster" />
              </li>
            ))}
          </ul>
        ) : null}

        {isSanityConfigured && projects.length === 0 ? (
          <p className="text-sm text-neutral-600">{t("empty")}</p>
        ) : null}

        <Link className="mt-2 text-sm text-neutral-600 underline hover:text-orange-600" href="/">
          ←
        </Link>
      </section>
    </main>
  );
}
