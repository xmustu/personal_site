import { getTranslations } from "next-intl/server";
import { MarkdownContent } from "@/components/content/MarkdownContent";
import { HeroDoodle } from "@/components/illustration/HeroDoodle";
import { Link } from "@/i18n/navigation";
import { isSanityConfigured } from "@/lib/sanity/client";
import { getAboutContent } from "@/lib/sanity/queries";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("About");
  const aboutContent = isSanityConfigured ? await getAboutContent() : null;
  const isZh = locale === "zh";

  const title = isZh ? aboutContent?.titleZh : aboutContent?.titleEn;
  const body = isZh ? aboutContent?.bodyZh : aboutContent?.bodyEn;
  const bodyContent = body || t("stub");
  const timeline = isZh
    ? [
        { year: "2026", title: "个人站与内容管道上线", desc: "建立技术写作 + 策展的持续发布闭环。" },
        { year: "2025", title: "聚焦 LLM 应用工程", desc: "从 Demo 转向可部署、可维护的 AI 产品化实践。" },
        { year: "2024", title: "工业设计智能化探索", desc: "将设计流程与自动化工具链结合，验证落地价值。" },
      ]
    : [
        { year: "2026", title: "Website and content pipeline launched", desc: "A repeatable loop for technical writing and curation." },
        { year: "2025", title: "Focused on LLM app engineering", desc: "From demos to deployable and maintainable AI products." },
        { year: "2024", title: "Intelligent industrial design exploration", desc: "Connected design workflow with automation tooling." },
      ];

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
            {timeline.map((item) => (
              <li className="site-lift rounded-xl border border-orange-100/80 bg-orange-50/30 px-4 py-3" key={item.year + item.title}>
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
