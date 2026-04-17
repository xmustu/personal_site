import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function parseEnvFile(content) {
  const result = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

/**
 * Loads `.env` then `.env.local` into `process.env` (same precedence idea as Next.js).
 * Plain `node` scripts do not load these files automatically.
 */
export function loadProjectEnv(cwd = process.cwd()) {
  const envFile = path.join(cwd, ".env");
  const localFile = path.join(cwd, ".env.local");

  if (existsSync(envFile)) {
    try {
      const parsed = parseEnvFile(readFileSync(envFile, "utf8"));
      for (const [key, value] of Object.entries(parsed)) {
        if (process.env[key] === undefined) {
          process.env[key] = value;
        }
      }
    } catch {
      // ignore unreadable .env
    }
  }

  if (existsSync(localFile)) {
    try {
      const parsed = parseEnvFile(readFileSync(localFile, "utf8"));
      for (const [key, value] of Object.entries(parsed)) {
        process.env[key] = value;
      }
    } catch {
      // ignore unreadable .env.local
    }
  }
}
