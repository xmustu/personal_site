import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import Parser from "rss-parser";

const ROOT_DIR = process.cwd();
const DEFAULT_CONFIG = "data/auto-sources.json";
const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; personal-site-auto-ingest/1.0; +https://personal-site-iota-navy.vercel.app)",
  },
});

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    configPath: DEFAULT_CONFIG,
    dryRun: false,
    watch: false,
    intervalMinutes: undefined,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--config") {
      options.configPath = args[i + 1] ?? DEFAULT_CONFIG;
      i += 1;
      continue;
    }
    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (arg === "--watch") {
      options.watch = true;
      continue;
    }
    if (arg === "--interval") {
      const value = Number(args[i + 1]);
      if (!Number.isNaN(value) && value > 0) {
        options.intervalMinutes = value;
      }
      i += 1;
    }
  }

  return options;
}

function loadConfig(configPath) {
  const absolutePath = path.isAbsolute(configPath)
    ? configPath
    : path.join(ROOT_DIR, configPath);
  const content = readFileSync(absolutePath, "utf8");
  const config = JSON.parse(content);

  return {
    keywords: Array.isArray(config.keywords) ? config.keywords : [],
    feeds: Array.isArray(config.feeds) ? config.feeds : [],
    seedSites: Array.isArray(config.seedSites) ? config.seedSites : [],
    maxItemsPerFeed:
      typeof config.maxItemsPerFeed === "number" ? config.maxItemsPerFeed : 20,
    maxUrlsPerRun:
      typeof config.maxUrlsPerRun === "number" ? config.maxUrlsPerRun : 15,
    intervalMinutes:
      typeof config.intervalMinutes === "number" ? config.intervalMinutes : 180,
  };
}

function normalizeText(text) {
  return (text ?? "").toString().toLowerCase();
}

function matchKeywords(text, keywords) {
  if (keywords.length === 0) {
    return true;
  }
  const normalized = normalizeText(text);
  return keywords.some((keyword) => normalized.includes(normalizeText(keyword)));
}

async function discoverFeedsFromSite(siteUrl) {
  const discovered = new Set();
  const commonCandidates = ["/feed", "/rss", "/rss.xml", "/feed.xml", "/atom.xml"];

  try {
    const response = await fetch(siteUrl);
    if (response.ok) {
      const html = await response.text();
      const regex = /<link[^>]+type=["'](?:application\/rss\+xml|application\/atom\+xml)[^>]*>/gi;
      const hrefRegex = /href=["']([^"']+)["']/i;

      for (const match of html.match(regex) ?? []) {
        const hrefMatch = match.match(hrefRegex);
        if (!hrefMatch?.[1]) {
          continue;
        }
        discovered.add(new URL(hrefMatch[1], siteUrl).toString());
      }
    }
  } catch {
    // ignore discovery failure from this site
  }

  for (const suffix of commonCandidates) {
    try {
      const candidate = new URL(suffix, siteUrl).toString();
      const response = await fetch(candidate, { method: "HEAD" });
      if (response.ok) {
        discovered.add(candidate);
      }
    } catch {
      // ignore invalid or blocked candidate
    }
  }

  return [...discovered];
}

async function collectCandidateUrls(config) {
  const feedSet = new Set(config.feeds);
  for (const seedSite of config.seedSites) {
    const discovered = await discoverFeedsFromSite(seedSite);
    discovered.forEach((url) => feedSet.add(url));
  }

  const matchedLinks = [];
  for (const feedUrl of feedSet) {
    try {
      const feed = await parser.parseURL(feedUrl);
      const items = (feed.items ?? []).slice(0, config.maxItemsPerFeed);

      for (const item of items) {
        const link = item.link?.trim();
        if (!link) {
          continue;
        }
        const searchableText = [item.title, item.contentSnippet, item.content]
          .filter(Boolean)
          .join(" ");
        if (matchKeywords(searchableText, config.keywords)) {
          matchedLinks.push(link);
        }
      }
    } catch (error) {
      console.warn(`[warn] feed parse failed: ${feedUrl} -> ${error.message}`);
    }
  }

  const unique = [...new Set(matchedLinks)];
  return unique.slice(0, config.maxUrlsPerRun);
}

function runManualIngest(urls, dryRun) {
  if (urls.length === 0) {
    console.log("No matched URLs in this run.");
    return Promise.resolve();
  }

  const tempDir = mkdtempSync(path.join(os.tmpdir(), "personal-site-ingest-"));
  const urlsFile = path.join(tempDir, "urls.txt");
  writeFileSync(urlsFile, urls.join("\n"), "utf8");

  const nodeCommand = process.execPath;
  const scriptPath = path.join(
    ROOT_DIR,
    "scripts",
    "content-pipeline",
    "manual-ingest.mjs",
  );
  const args = [scriptPath, "--urls", urlsFile];
  if (dryRun) {
    args.push("--dry-run");
  }

  return new Promise((resolve, reject) => {
    const child = spawn(nodeCommand, args, {
      cwd: ROOT_DIR,
      stdio: "inherit",
      shell: false,
    });

    child.on("error", (error) => {
      rmSync(tempDir, { recursive: true, force: true });
      reject(error);
    });

    child.on("exit", (code) => {
      rmSync(tempDir, { recursive: true, force: true });
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`manual ingest exited with code ${code}`));
      }
    });
  });
}

async function runOnce(options) {
  const config = loadConfig(options.configPath);
  const urls = await collectCandidateUrls(config);
  console.log(`Matched URLs: ${urls.length}`);
  await runManualIngest(urls, options.dryRun);
}

async function runWatch(options) {
  const config = loadConfig(options.configPath);
  const intervalMinutes = options.intervalMinutes ?? config.intervalMinutes;
  const intervalMs = intervalMinutes * 60 * 1000;

  // First run immediately.
  await runOnce(options);

  console.log(`Watching... next run every ${intervalMinutes} minutes.`);
  setInterval(async () => {
    try {
      await runOnce(options);
    } catch (error) {
      console.error(`[watch] run failed: ${error.message}`);
    }
  }, intervalMs);
}

async function main() {
  const options = parseArgs();
  if (options.watch) {
    await runWatch(options);
    return;
  }
  await runOnce(options);
}

main().catch((error) => {
  console.error(`Auto ingest failed: ${error.message}`);
  process.exit(1);
});
