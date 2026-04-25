const COOKIE_NAME = "owner_console";
const TOKEN_PREFIX = "v1";
export const OWNER_CONSOLE_COOKIE = COOKIE_NAME;
export const OWNER_CONSOLE_TTL_SEC = 7 * 24 * 60 * 60;

function getSecret(): string | undefined {
  return process.env.SITE_OWNER_CONSOLE_SECRET?.trim();
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const buf = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return bytesToHex(new Uint8Array(buf));
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

function timingSafeEqualUtf8(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ba = enc.encode(a);
  const bb = enc.encode(b);
  if (ba.length !== bb.length) {
    return false;
  }
  let out = 0;
  for (let i = 0; i < ba.length; i++) {
    out |= (ba[i] ?? 0) ^ (bb[i] ?? 0);
  }
  return out === 0;
}

/** 生成 Cookie 值（仅服务端调用）。 */
export async function createOwnerConsoleToken(): Promise<string | null> {
  const secret = getSecret();
  if (!secret) {
    return null;
  }
  const exp = Date.now() + OWNER_CONSOLE_TTL_SEC * 1000;
  const signingInput = `${TOKEN_PREFIX}|${exp}`;
  const sig = await hmacSha256Hex(secret, signingInput);
  return `${signingInput}|${sig}`;
}

/** 校验 Cookie 值（中间件 / 服务端）。 */
export async function verifyOwnerConsoleToken(token: string): Promise<boolean> {
  const secret = getSecret();
  if (!secret || !token) {
    return false;
  }
  const parts = token.split("|");
  if (parts.length !== 3 || parts[0] !== TOKEN_PREFIX) {
    return false;
  }
  const exp = Number(parts[1]);
  const sig = parts[2];
  if (!Number.isFinite(exp) || !sig) {
    return false;
  }
  if (Date.now() > exp) {
    return false;
  }
  const signingInput = `${TOKEN_PREFIX}|${exp}`;
  const expected = await hmacSha256Hex(secret, signingInput);
  return timingSafeEqualHex(sig, expected);
}

export function isOwnerConsoleConfigured(): boolean {
  return Boolean(getSecret() && process.env.SITE_OWNER_CONSOLE_PASSWORD?.trim());
}

export function verifyOwnerConsolePassword(candidate: string): boolean {
  const expected = process.env.SITE_OWNER_CONSOLE_PASSWORD?.trim();
  if (!expected || !candidate) {
    return false;
  }
  return timingSafeEqualUtf8(candidate, expected);
}
