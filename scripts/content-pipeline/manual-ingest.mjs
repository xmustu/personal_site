import { readFileSync } from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { createClient } from "@sanity/client";
import { loadProjectEnv } from "./load-env.mjs";

loadProjectEnv();

const ROOT_DIR = process.cwd();

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    urlsFile: "",
    dryRun: false,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--urls") {
      options.urlsFile = args[i + 1] ?? "";
      i += 1;
      continue;
    }
    if (arg === "--dry-run") {
      options.dryRun = true;
    }
  }

  if (!options.urlsFile) {
    throw new Error("Missing required argument: --urls <file>");
  }

  return options;
}

function createSlug(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function toBlocks(paragraphs) {
  return paragraphs.map((text) => ({
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        marks: [],
        text,
      },
    ],
  }));
}

function parseUrlsFromFile(filePath) {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(ROOT_DIR, filePath);
  const content = readFileSync(absolutePath, "utf8");

  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

function createSanityClient() {
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ||
    process.env.SANITY_STUDIO_PROJECT_ID?.trim();
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ||
    process.env.SANITY_STUDIO_DATASET?.trim() ||
    "production";
  const token =
    process.env.SANITY_API_WRITE_TOKEN?.trim() ||
    process.env.SANITY_API_READ_TOKEN?.trim();

  if (!projectId) {
    throw new Error(
      "Missing Sanity project id: set NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_STUDIO_PROJECT_ID in .env.local (Node scripts do not load it automatically; ingest scripts load .env / .env.local for you).",
    );
  }

  if (!token) {
    throw new Error("Missing SANITY_API_WRITE_TOKEN (or SANITY_API_READ_TOKEN)");
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: "2026-04-15",
    token,
    useCdn: false,
  });
}

/** Many publishers (e.g. OpenAI) return 403 for obvious bot User-Agents; mimic a normal browser. */
function articleFetchHeaders(targetUrl) {
  const customUa = process.env.INGEST_USER_AGENT?.trim();
  let origin = "";
  try {
    origin = new URL(targetUrl).origin;
  } catch {
    // ignore
  }
  return {
    "User-Agent":
      customUa ||
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "Upgrade-Insecure-Requests": "1",
    ...(origin ? { Referer: `${origin}/` } : {}),
  };
}

function jina403FallbackEnabled() {
  const v = process.env.INGEST_JINA_ON_403?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

function extractArticleFromHtml(pageUrl, html) {
  const dom = new JSDOM(html, { url: pageUrl });
  const doc = dom.window.document;
  const readable = new Readability(doc).parse();

  const title =
    readable?.title?.trim() ||
    doc.querySelector("meta[property='og:title']")?.getAttribute("content")?.trim() ||
    doc.title?.trim() ||
    "未命名来源";

  const description =
    doc
      .querySelector("meta[name='description']")
      ?.getAttribute("content")
      ?.trim() ||
    readable?.excerpt?.trim() ||
    "";

  const textContent = readable?.textContent?.replace(/\s+/g, " ").trim() || "";
  const textPreview = textContent.slice(0, 1200);
  const chunks = textPreview
    .split(/[。！？.!?]\s*/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, 6);

  return {
    title,
    description,
    chunks,
  };
}

/** 403 时可选：由 r.jina.ai 拉取可读正文（会把目标 URL 发给第三方服务，需显式 INGEST_JINA_ON_403）。 */
async function fetchArticleViaJinaReader(url) {
  const clean = url.split("#")[0].trim();
  const jinaUrl = `https://r.jina.ai/${clean}`;
  const r = await fetch(jinaUrl, {
    redirect: "follow",
    headers: {
      Accept: "text/markdown",
      "User-Agent": articleFetchHeaders(url)["User-Agent"],
    },
  });

  if (!r.ok) {
    throw new Error(`Jina reader failed: ${r.status}`);
  }

  const md = (await r.text()).trim();
  const titleMatch = md.match(/^#\s+(.+)$/m);
  const title = titleMatch?.[1]?.trim() || "未命名来源";
  const afterTitle =
    titleMatch && titleMatch.index !== undefined
      ? md.slice(titleMatch.index + titleMatch[0].length).trim()
      : md;
  const paragraphs = afterTitle
    .split(/\n\n+/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 12);
  const description = paragraphs[0]?.slice(0, 280) || "";
  const chunks = paragraphs.slice(0, 6).map((p) => (p.length > 400 ? `${p.slice(0, 397)}...` : p));

  return {
    title,
    description,
    chunks: chunks.length > 0 ? chunks : [description || md.slice(0, 400)],
  };
}

async function fetchArticle(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: articleFetchHeaders(url),
  });

  if (response.status === 403 && jina403FallbackEnabled()) {
    console.warn(`[warn] direct fetch 403 -> using Jina reader for ${url}`);
    return fetchArticleViaJinaReader(url);
  }

  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status}（若站点反爬，可在 .env.local 设置 INGEST_JINA_ON_403=1 经 r.jina.ai 回退，或设置 INGEST_USER_AGENT 为本机浏览器 UA，或换用 RSS 全文/其它来源）`,
    );
  }

  const html = await response.text();
  return extractArticleFromHtml(url, html);
}

function makeDraftPost(url, article) {
  const datePrefix = new Date().toISOString().slice(0, 10);
  const slugValue = createSlug(`${datePrefix}-${article.title || "source"}`);
  const excerpt = article.description || article.chunks[0] || "自动抓取草稿，请补充摘要。";

  const markdownLikeParagraphs = [
    `来源：${url}`,
    "",
    "### 快速摘要（自动生成草稿）",
    excerpt,
    "",
    "### 关键要点（自动提取）",
    ...article.chunks.map((chunk, index) => `${index + 1}. ${chunk}`),
    "",
    "### 编辑备注",
    "请在发布前补充你的观点、结论与上下文，并核对原始来源。",
  ].filter(Boolean);

  return {
    _id: `_drafts.${slugValue}`,
    _type: "post",
    title: `【草稿】${article.title}`,
    slug: {
      _type: "slug",
      current: slugValue,
    },
    publishedAt: new Date().toISOString(),
    excerpt,
    sourceUrl: url,
    body: toBlocks(markdownLikeParagraphs),
  };
}

async function ensureNotExists(client, slug) {
  const query = `*[_type == "post" && slug.current == $slug][0]._id`;
  const existingId = await client.fetch(query, { slug });
  return !existingId;
}

async function main() {
  const options = parseArgs();
  const urls = parseUrlsFromFile(options.urlsFile);

  if (urls.length === 0) {
    throw new Error("No valid URLs found in file.");
  }

  const client = createSanityClient();
  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const url of urls) {
    try {
      const article = await fetchArticle(url);
      const draft = makeDraftPost(url, article);
      const canCreate = await ensureNotExists(client, draft.slug.current);

      if (!canCreate) {
        skipped += 1;
        console.log(`[skip] existing slug: ${draft.slug.current}`);
        continue;
      }

      if (options.dryRun) {
        created += 1;
        console.log(`[dry-run] ${draft.title}`);
        continue;
      }

      await client.createOrReplace(draft);
      created += 1;
      console.log(`[ok] draft created: ${draft.title}`);
    } catch (error) {
      failed += 1;
      console.error(`[fail] ${url} -> ${error.message}`);
    }
  }

  console.log(
    `Done. created=${created}, skipped=${skipped}, failed=${failed}, mode=${
      options.dryRun ? "dry-run" : "write"
    }`,
  );
}

main().catch((error) => {
  console.error(`Manual ingest failed: ${error.message}`);
  process.exit(1);
});
