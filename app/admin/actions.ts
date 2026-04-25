"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OWNER_CONSOLE_COOKIE } from "@/lib/admin/consoleSession";

export async function ownerConsoleLogout() {
  const jar = await cookies();
  jar.delete({ name: OWNER_CONSOLE_COOKIE, path: "/admin" });
  redirect("/admin/login");
}
