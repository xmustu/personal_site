import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { isSanityConfigured } from "@/lib/sanity/client";
import { getProjectList } from "@/lib/sanity/queries";

export default async function ProjectsPage() {
  const t = await getTranslations("Projects");
  const projects = isSanityConfigured ? await getProjectList() : [];

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="text-neutral-700 leading-relaxed">{t("stub")}</p>
      {!isSanityConfigured ? (
        <p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {t("notConfigured")}
        </p>
      ) : null}

      {isSanityConfigured && projects.length > 0 ? (
        <ul className="mt-2 space-y-3">
          {projects.map((project) => (
            <li
              className="rounded-lg border border-neutral-200 bg-white px-4 py-3"
              key={project._id}
            >
              <p className="font-medium text-neutral-900">{project.title}</p>
              {project.summary ? (
                <p className="mt-1 text-sm text-neutral-600">{project.summary}</p>
              ) : null}
              {project.stack?.length ? (
                <p className="mt-2 text-xs text-neutral-500">
                  {project.stack.join(" / ")}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {isSanityConfigured && projects.length === 0 ? (
        <p className="text-sm text-neutral-600">{t("empty")}</p>
      ) : null}

      <Link className="text-sm text-neutral-600 underline" href="/">
        ←
      </Link>
    </main>
  );
}
