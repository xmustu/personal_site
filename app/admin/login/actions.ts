"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createOwnerConsoleToken,
  isOwnerConsoleConfigured,
  OWNER_CONSOLE_COOKIE,
  OWNER_CONSOLE_TTL_SEC,
  verifyOwnerConsolePassword,
} from "@/lib/admin/consoleSession";

export type LoginState = { error: string | null };

export async function ownerConsoleLogin(
  _prev: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  if (!isOwnerConsoleConfigured()) {
    return {
      error: "未配置 SITE_OWNER_CONSOLE_SECRET 与 SITE_OWNER_CONSOLE_PASSWORD，无法登录。",
    };
  }

  const password = formData.get("password");
  if (typeof password !== "string" || !password) {
    return { error: "请输入密码。" };
  }

  if (!verifyOwnerConsolePassword(password)) {
    return { error: "密码错误。" };
  }

  const token = await createOwnerConsoleToken();
  if (!token) {
    return { error: "无法签发会话，请检查 SITE_OWNER_CONSOLE_SECRET。" };
  }

  const jar = await cookies();
  jar.set(OWNER_CONSOLE_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: OWNER_CONSOLE_TTL_SEC,
  });

  redirect("/admin");
}
