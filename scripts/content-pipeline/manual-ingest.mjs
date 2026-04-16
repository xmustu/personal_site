import { readFileSync } from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { createClient } from "@sanity/client";

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
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
  const token =
    process.env.SANITY_API_WRITE_TOKEN?.trim() ||
    process.env.SANITY_API_READ_TOKEN?.trim();

  if (!projectId) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
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

async function fetchArticle(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; personal-site-ingest/1.0; +https://personal-site-iota-navy.vercel.app)",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const html = await response.text();
  const dom = new JSDOM(html, { url });
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
