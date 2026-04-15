import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT_DIR = process.cwd();
const ENV_LOCAL_PATH = path.join(ROOT_DIR, ".env.local");
const DEV_PORT = 3100;
const DEV_BASE_URL = `http://localhost:${DEV_PORT}`;
const REQUIRED_ENV_KEYS = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
];
const OPTIONAL_ENV_KEYS = [
  "NEXT_PUBLIC_GA_MEASUREMENT_ID",
  "NEXT_PUBLIC_GISCUS_REPO",
  "NEXT_PUBLIC_GISCUS_REPO_ID",
  "NEXT_PUBLIC_GISCUS_CATEGORY",
  "NEXT_PUBLIC_GISCUS_CATEGORY_ID",
  "RESEND_API_KEY",
  "CONTACT_TO_EMAIL",
  "CONTACT_FROM_EMAIL",
];
const ROUTES_TO_CHECK = [
  "/",
  "/about",
  "/projects",
  "/blog",
  "/contact",
  "/en",
  "/en/about",
  "/en/projects",
  "/en/blog",
  "/en/contact",
  "/sitemap.xml",
  "/robots.txt",
];

function parseDotEnv(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }
  const content = readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const result = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const equalIndex = trimmed.indexOf("=");
    if (equalIndex < 0) {
      continue;
    }
    const key = trimmed.slice(0, equalIndex).trim();
    const value = trimmed.slice(equalIndex + 1).trim();
    result[key] = value;
  }

  return result;
}

function createRunner() {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  return (args, label) =>
    new Promise((resolve, reject) => {
      const child = spawn(npmCommand, args, {
        cwd: ROOT_DIR,
        stdio: "inherit",
        shell: false,
      });
      child.on("error", (error) => reject(new Error(`${label} failed: ${error.message}`)));
      child.on("exit", (code) => {
        if (code === 0) {
          resolve();
          return;
        }
        reject(new Error(`${label} failed with exit code ${code}`));
      });
    });
}

async function waitForDevServer(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status >= 300) {
        return;
      }
    } catch {
      // server not ready yet
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error("Dev server did not start in time.");
}

async function checkRoutes(baseUrl) {
  const failed = [];
  for (const route of ROUTES_TO_CHECK) {
    const response = await fetch(`${baseUrl}${route}`);
    if (!response.ok) {
      failed.push(`${route} -> ${response.status}`);
    }
  }
  return failed;
}

async function withDevServer(task) {
  const nextCommand = process.platform === "win32" ? "npx.cmd" : "npx";
  const devServer = spawn(nextCommand, ["next", "dev", "-p", String(DEV_PORT)], {
    cwd: ROOT_DIR,
    stdio: "ignore",
    shell: false,
  });

  try {
    await waitForDevServer(`${DEV_BASE_URL}/`);
    return await task();
  } finally {
    devServer.kill("SIGTERM");
  }
}

async function main() {
  const runNpm = createRunner();
  const envLocal = parseDotEnv(ENV_LOCAL_PATH);

  console.log("== Preflight: env check ==");
  const missingRequired = REQUIRED_ENV_KEYS.filter((key) => !envLocal[key]);
  if (missingRequired.length > 0) {
    throw new Error(
      `Missing required keys in .env.local: ${missingRequired.join(", ")}`,
    );
  }

  const missingOptional = OPTIONAL_ENV_KEYS.filter((key) => !envLocal[key]);
  if (missingOptional.length > 0) {
    console.warn(
      `[warn] Optional keys not set: ${missingOptional.join(", ")}`,
    );
  }

  console.log("== Preflight: route check ==");
  await withDevServer(async () => {
    const failedRoutes = await checkRoutes(DEV_BASE_URL);
    if (failedRoutes.length > 0) {
      throw new Error(`Route checks failed:\n${failedRoutes.join("\n")}`);
    }
  });

  console.log("== Preflight: production build check ==");
  await runNpm(["run", "build"], "build");

  console.log("Preflight checks passed.");
}

main().catch((error) => {
  console.error(`Preflight failed: ${error.message}`);
  process.exit(1);
});
