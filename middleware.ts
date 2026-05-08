import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { auth } from "@/lib/auth/config";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PATTERNS = ["/account", "/checkout"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strip locale prefix to get bare path
  const pathnameWithoutLocale = pathname.replace(/^\/(vi|en)/, "");

  const isProtected = PROTECTED_PATTERNS.some((pattern) =>
    pathnameWithoutLocale.startsWith(pattern)
  );

  if (isProtected) {
    const session = await auth();
    if (!session) {
      const segments = pathname.split("/");
      const locale = segments[1] ?? "vi";
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|_vercel|api|.*\\..*).*)"],
};
