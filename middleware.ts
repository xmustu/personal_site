import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import {
  OWNER_CONSOLE_COOKIE,
  verifyOwnerConsoleToken,
} from "@/lib/admin/consoleSession";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAdminPath(pathname)) {
    const isLogin = pathname === "/admin/login" || pathname.startsWith("/admin/login/");
    const token = request.cookies.get(OWNER_CONSOLE_COOKIE)?.value ?? "";
    const sessionOk = token ? await verifyOwnerConsoleToken(token) : false;

    if (isLogin) {
      if (sessionOk) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    if (!sessionOk) {
      const login = new URL("/admin/login", request.url);
      return NextResponse.redirect(login);
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(zh|en)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
