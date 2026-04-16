import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createServer } from "node:net";
import path from "node:path";

const ROOT_DIR = process.cwd();
const ENV_LOCAL_PATH = path.join(ROOT_DIR, ".env.local");
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
  "/blog/rss",
  "/workflow",
  "/contact",
  "/en",
  "/en/about",
  "/en/projects",
  "/en/blog",
  "/en/blog/rss",
  "/en/workflow",
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
  const toShellCommand = (args) => [npmCommand, ...args].join(" ");

  return (args, label) =>
    new Promise((resolve, reject) => {
      const child = spawn(toShellCommand(args), [], {
        cwd: ROOT_DIR,
        stdio: "inherit",
        shell: true,
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

async function getAvailablePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, "127.0.0.1");
    server.on("listening", () => {
      const address = server.address();
      if (typeof address === "object" && address?.port) {
        const { port } = address;
        server.close(() => resolve(port));
      } else {
        server.close(() => reject(new Error("Unable to resolve an available port.")));
      }
    });
    server.on("error", reject);
  });
}

async function stopDevServer(devServer) {
  if (!devServer?.pid) {
    return;
  }

  if (process.platform === "win32") {
    await new Promise((resolve) => {
      const killer = spawn("taskkill", ["/PID", String(devServer.pid), "/T", "/F"], {
        stdio: "ignore",
        shell: false,
      });
      killer.on("exit", () => resolve());
      killer.on("error", () => resolve());
    });
    return;
  }

  devServer.kill("SIGTERM");
}

async function withDevServer(task) {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const port = await getAvailablePort();
  const baseUrl = `http://localhost:${port}`;
  const devServer = spawn(`${npmCommand} run dev -- -p ${port}`, [], {
    cwd: ROOT_DIR,
    stdio: "ignore",
    shell: true,
  });

  let spawnError = null;
  devServer.on("error", (error) => {
    spawnError = error;
  });

  try {
    if (spawnError) {
      throw new Error(`Unable to start dev server: ${spawnError.message}`);
    }
    await waitForDevServer(`${baseUrl}/`);
    return await task(baseUrl);
  } finally {
    await stopDevServer(devServer);
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
  await withDevServer(async (baseUrl) => {
    const failedRoutes = await checkRoutes(baseUrl);
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
