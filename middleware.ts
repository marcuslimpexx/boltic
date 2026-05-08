/**
 * Edge-Runtime middleware — only "next/server", zero third-party imports.
 *
 * next-intl/middleware crashes in Vercel's Edge Runtime; this custom
 * implementation reproduces its essential behaviour:
 *   1. Redirect bare paths to the default locale prefix.
 *   2. Set the x-next-intl-locale header so getRequestConfig can read it.
 *   3. Redirect unauthenticated users away from protected routes.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["vi", "en"] as const;
type Locale = (typeof LOCALES)[number];
const DEFAULT_LOCALE: Locale = "vi";

// Routes that require a session cookie
const PROTECTED_PREFIXES = ["/admin", "/account", "/checkout"];

function detectLocale(pathname: string): Locale | null {
  for (const locale of LOCALES) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return locale;
    }
  }
  return null;
}

function isAuthenticated(request: NextRequest): boolean {
  return (
    request.cookies.has("authjs.session-token") ||
    request.cookies.has("__Secure-authjs.session-token")
  );
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname, search } = request.nextUrl;

  const locale = detectLocale(pathname);

  // 1. No locale prefix → redirect to default locale
  if (!locale) {
    const url = new URL(
      `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}${search}`,
      request.url
    );
    return NextResponse.redirect(url);
  }

  // 2. Auth guard — strip locale to compare against protected prefixes
  const bare = pathname.slice(locale.length + 1) || "/"; // e.g. "/admin/..."
  const bareWithSlash = bare.startsWith("/") ? bare : `/${bare}`;
  const needsAuth = PROTECTED_PREFIXES.some((p) =>
    bareWithSlash.startsWith(p)
  );

  if (needsAuth && !isAuthenticated(request)) {
    const loginUrl = new URL(`/${locale}/login${search}`, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Pass through — set locale header for next-intl getRequestConfig
  const response = NextResponse.next();
  response.headers.set("x-next-intl-locale", locale);
  return response;
}

export const config = {
  matcher: ["/((?!_next|_vercel|api|.*\\..*).*)"],
};
