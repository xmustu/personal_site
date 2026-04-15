import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { isSanityConfigured } from "@/lib/sanity/client";
import { getProjectBySlug } from "@/lib/sanity/queries";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const t = await getTranslations("Projects");
  const { slug } = await params;

  if (!isSanityConfigured) {
    return (
      <main className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {t("notConfigured")}
        </p>
      </main>
    );
  }

  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
      {project.summary ? (
        <p className="text-neutral-700 leading-relaxed">{project.summary}</p>
      ) : null}
      {project.stack?.length ? (
        <p className="text-xs text-neutral-500">{project.stack.join(" / ")}</p>
      ) : null}
      <div className="flex gap-4 text-sm text-neutral-700">
        {project.repoUrl ? (
          <a className="underline" href={project.repoUrl} rel="noreferrer" target="_blank">
            GitHub
          </a>
        ) : null}
        {project.demoUrl ? (
          <a className="underline" href={project.demoUrl} rel="noreferrer" target="_blank">
            Demo
          </a>
        ) : null}
      </div>
      <p className="text-sm text-neutral-500">
        Detailed body rendering will be wired next (Portable Text).
      </p>
      <Link className="text-sm text-neutral-600 underline" href="/projects">
        ←
      </Link>
    </main>
  );
}
