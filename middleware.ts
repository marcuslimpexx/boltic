import NextAuth from "next-auth";
import { edgeAuthConfig } from "@/lib/auth/edge.config";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Lightweight NextAuth instance — Edge-safe (no bcrypt, no DB)
const { auth } = NextAuth(edgeAuthConfig);

const intlMiddleware = createMiddleware(routing);

const ADMIN_PATTERNS = ["/admin"];
const PROTECTED_PATTERNS = ["/account", "/checkout"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const localePattern = new RegExp(`^/(${routing.locales.join("|")})`);
  const pathnameWithoutLocale = pathname.replace(localePattern, "");

  const isAdmin = ADMIN_PATTERNS.some((p) =>
    pathnameWithoutLocale.startsWith(p)
  );
  const isProtected = PROTECTED_PATTERNS.some((pattern) =>
    pathnameWithoutLocale.startsWith(pattern)
  );

  if (isAdmin || isProtected) {
    const session = await auth();
    if (!session) {
      const segments = pathname.split("/");
      const locale = segments[1] ?? "vi";
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (isAdmin && session.user?.role !== "admin") {
      const segments = pathname.split("/");
      const locale = segments[1] ?? "vi";
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|_vercel|api|.*\\..*).*)"],
};
