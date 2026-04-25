import { getTranslations } from "next-intl/server";
import { MarkdownContent } from "@/components/content/MarkdownContent";
import { HeroDoodle } from "@/components/illustration/HeroDoodle";
import { Link } from "@/i18n/navigation";
import {
  ABOUT_TIMELINE_FALLBACK_EN,
  ABOUT_TIMELINE_FALLBACK_ZH,
} from "@/lib/content/aboutTimelineFallback";
import { isSanityConfigured } from "@/lib/sanity/client";
import { getAboutContent, type AboutTimelineItem } from "@/lib/sanity/queries";

type Props = {
  params: Promise<{ locale: string }>;
};

type TimelineRow = { year: string; title: string; desc: string };

function buildAboutTimeline(
  rows: AboutTimelineItem[] | null | undefined,
  fallback: readonly { year: string; title: string; description: string }[],
): TimelineRow[] {
  const fromCms = rows
    ?.map((r) => ({
      year: (r.year ?? "").trim(),
      title: (r.title ?? "").trim(),
      desc: (r.description ?? "").trim(),
    }))
    .filter((r) => r.year || r.title);
  if (fromCms && fromCms.length > 0) {
    return fromCms;
  }
  return fallback.map((r) => ({
    year: r.year,
    title: r.title,
    desc: r.description,
  }));
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("About");
  const aboutContent = isSanityConfigured ? await getAboutContent() : null;
  const isZh = locale === "zh";

  const title = isZh ? aboutContent?.titleZh : aboutContent?.titleEn;
  const body = isZh ? aboutContent?.bodyZh : aboutContent?.bodyEn;
  const bodyContent = body || t("stub");
  const timeline = buildAboutTimeline(
    isZh ? aboutContent?.timelineZh : aboutContent?.timelineEn,
    isZh ? ABOUT_TIMELINE_FALLBACK_ZH : ABOUT_TIMELINE_FALLBACK_EN,
  );

  return (
    <main className="site-shell py-16">
      <section className="site-card flex flex-col gap-5">
        <div className="-mx-2 -mt-2 rounded-2xl bg-orange-50/40 p-2">
          <HeroDoodle className="w-full" />
        </div>
        <p className="site-kicker">{isZh ? "关于作者" : "About author"}</p>
        <h1 className="site-title">{title || t("title")}</h1>
        <div className="rounded-xl border border-orange-100 bg-orange-50/50 px-4 py-3 text-sm text-orange-700">
          {isZh ? "核心方向：大模型应用工程与工业设计智能化落地" : "Focus: LLM application engineering for intelligent industrial design workflows"}
        </div>
        <div className="site-grid-two">
          <div className="site-card-soft">
            <p className="site-kicker">{isZh ? "工作方式" : "How I work"}</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              {isZh ? "先明确问题，再搭建可验证最小方案，最后持续迭代上线。" : "Clarify first, ship an verifiable MVP, then iterate in production."}
            </p>
          </div>
          <div className="site-card-soft">
            <p className="site-kicker">{isZh ? "关注领域" : "Focus areas"}</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              {isZh ? "AI Agent、LLM 应用工程、智能化设计流程、开发效率工具链。" : "AI agents, LLM app engineering, intelligent design workflow, and developer productivity tooling."}
            </p>
          </div>
        </div>
        <section className="rounded-2xl border border-orange-100 bg-white/80 p-4">
          <p className="site-kicker">{isZh ? "时间线" : "Timeline"}</p>
          <ul className="mt-4 space-y-3">
            {timeline.map((item, index) => (
              <li
                className="site-lift rounded-xl border border-orange-100/80 bg-orange-50/30 px-4 py-3"
                key={`${item.year}-${item.title}-${index}`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">{item.year}</p>
                <p className="mt-1 text-sm font-semibold text-neutral-900">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600">{item.desc}</p>
              </li>
            ))}
          </ul>
        </section>
        <MarkdownContent className="site-body" content={bodyContent} />
        <Link className="mt-2 text-sm text-neutral-600 underline hover:text-orange-600" href="/">
          ←
        </Link>
      </section>
    </main>
  );
}
