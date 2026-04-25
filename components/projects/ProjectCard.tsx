import { Link } from "@/i18n/navigation";
import type { ProjectCardModel } from "@/lib/projects/enrichProjectCards";

type Props = {
  project: ProjectCardModel;
  /** 首页侧栏等小条目 */
  variant: "compact" | "poster";
  /** poster 在宽屏下占两列（首页精选第一个） */
  featuredWide?: boolean;
};

const posterShell =
  "site-lift group relative overflow-hidden rounded-2xl border text-left transition hover:border-orange-200";
const posterBg = "absolute inset-0 bg-cover bg-center transition duration-300 group-hover:scale-[1.02]";
const posterOverlay =
  "absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/20";
const posterBody = "relative flex h-full min-h-[140px] flex-col justify-end p-4 md:min-h-[160px]";

function PosterInner({
  title,
  summary,
  stack,
}: {
  title: string;
  summary?: string;
  stack?: string[];
}) {
  return (
    <>
      <p className="text-base font-semibold text-white drop-shadow-sm md:text-lg">{title}</p>
      {summary ? (
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-white/90">{summary}</p>
      ) : null}
      {stack?.length ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {stack.slice(0, 6).map((tag) => (
            <span
              className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </>
  );
}

export function ProjectCard({ project, variant, featuredWide }: Props) {
  const { cardHref, cardExternal, coverUrl, displayTitle, displaySummary, displayStack } =
    project;

  const innerCompact = (
    <>
      <div
        className="h-14 w-14 shrink-0 rounded-xl border border-white/40 bg-neutral-200 bg-cover bg-center shadow-inner"
        style={
          coverUrl
            ? { backgroundImage: `url(${coverUrl})` }
            : { backgroundColor: "var(--site-line)" }
        }
      />
      <div className="min-w-0 flex-1">
        <span className="font-medium text-neutral-900 group-hover:text-orange-700">
          {displayTitle}
        </span>
        {displaySummary ? (
          <p className="mt-0.5 line-clamp-2 text-sm text-neutral-600">{displaySummary}</p>
        ) : null}
        {displayStack?.length ? (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {displayStack.slice(0, 4).map((tag) => (
              <span
                className="rounded-full bg-orange-100/80 px-2 py-0.5 text-[11px] font-medium text-orange-800"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );

  const posterVisual = (
    <>
      {coverUrl ? (
        <div className={posterBg} style={{ backgroundImage: `url(${coverUrl})` }} />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-orange-100/90 to-amber-50/80"
          style={{ borderColor: "var(--site-line)" }}
        />
      )}
      <div className={posterOverlay} />
      <div className={posterBody}>
        <PosterInner summary={displaySummary} stack={displayStack} title={displayTitle} />
      </div>
    </>
  );

  const compactClass =
    "group flex gap-3 rounded-xl border bg-white/80 px-3 py-2.5 transition hover:border-orange-200 hover:bg-orange-50/40";

  if (cardExternal) {
    if (variant === "compact") {
      return (
        <a
          className={compactClass}
          href={cardHref}
          rel="noopener noreferrer"
          style={{ borderColor: "var(--site-line)" }}
        >
          {innerCompact}
        </a>
      );
    }
    return (
      <a
        className={`${posterShell} ${featuredWide ? "md:col-span-2" : ""} block`}
        href={cardHref}
        rel="noopener noreferrer"
        style={{ borderColor: "var(--site-line)", backgroundColor: "#fffdf9" }}
      >
        {posterVisual}
      </a>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        className={compactClass}
        href={cardHref}
        style={{ borderColor: "var(--site-line)" }}
      >
        {innerCompact}
      </Link>
    );
  }

  return (
    <Link
      className={`${posterShell} ${featuredWide ? "md:col-span-2" : ""} block`}
      href={cardHref}
      style={{ borderColor: "var(--site-line)", backgroundColor: "#fffdf9" }}
    >
      {posterVisual}
    </Link>
  );
}
