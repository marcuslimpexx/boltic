/**
 * Edge-Runtime middleware — no external JWT libraries, no @/ path aliases.
 *
 * Route protection uses a lightweight cookie-existence check.  All actual
 * authorisation (role check, session validity) is enforced server-side in
 * the page components and Server Actions — this layer just handles the
 * redirect UX for unauthenticated visitors.
 */
import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// ── Inline routing config (mirrors @/i18n/routing) ───────────────────────────
const LOCALES = ["vi", "en"] as const;
type Locale = (typeof LOCALES)[number];
const DEFAULT_LOCALE: Locale = "vi";

const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
  localeDetection: false,
});

// ── Route guards ──────────────────────────────────────────────────────────────
const PROTECTED_PREFIXES = ["/admin", "/account", "/checkout"];

function localeFromPathname(pathname: string): Locale {
  const seg = pathname.split("/")[1] ?? "";
  return (LOCALES as readonly string[]).includes(seg)
    ? (seg as Locale)
    : DEFAULT_LOCALE;
}

function isAuthenticated(request: NextRequest): boolean {
  // NextAuth v5 sets one of these two cookies
  return (
    request.cookies.has("authjs.session-token") ||
    request.cookies.has("__Secure-authjs.session-token")
  );
}

// ── Handler ───────────────────────────────────────────────────────────────────
export default function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Strip locale prefix to check route type
  const bare = pathname.replace(/^\/(vi|en)/, "");
  const needsAuth = PROTECTED_PREFIXES.some((p) => bare.startsWith(p));

  if (needsAuth && !isAuthenticated(request)) {
    const locale = localeFromPathname(pathname);
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(request) as NextResponse;
}

export const config = {
  matcher: ["/((?!_next|_vercel|api|.*\\..*).*)"],
};
