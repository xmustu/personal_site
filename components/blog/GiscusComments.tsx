"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";

const GISCUS_CONFIG = {
  repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
  repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
  category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
  categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
};

function mapGiscusLanguage(locale: string) {
  if (locale === "zh") {
    return "zh-CN";
  }
  return "en";
}

export function GiscusComments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useTranslations("Blog");
  const isConfigured =
    Boolean(GISCUS_CONFIG.repo) &&
    Boolean(GISCUS_CONFIG.repoId) &&
    Boolean(GISCUS_CONFIG.category) &&
    Boolean(GISCUS_CONFIG.categoryId);

  useEffect(() => {
    if (!isConfigured || !containerRef.current) {
      return;
    }

    containerRef.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", GISCUS_CONFIG.repo!);
    script.setAttribute("data-repo-id", GISCUS_CONFIG.repoId!);
    script.setAttribute("data-category", GISCUS_CONFIG.category!);
    script.setAttribute("data-category-id", GISCUS_CONFIG.categoryId!);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", mapGiscusLanguage(locale));
    containerRef.current.appendChild(script);
  }, [isConfigured, locale]);

  if (!isConfigured) {
    return (
      <p className="rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
        {t("commentsNotConfigured")}
      </p>
    );
  }

  return <div ref={containerRef} />;
}
