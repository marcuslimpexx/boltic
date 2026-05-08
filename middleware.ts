/**
 * Edge-Runtime middleware — zero @/ path-alias imports.
 *
 * Vercel's Edge Function bundler cannot resolve project-local @/ aliases, so
 * everything that was previously imported from @/i18n/routing or
 * @/lib/auth/edge.config is inlined here.  Auth is verified with
 * @auth/core/jwt (pure Web Crypto — no Node.js crypto module needed).
 */
import createMiddleware from "next-intl/middleware";
import { decode } from "@auth/core/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// ── Routing config (mirrors @/i18n/routing) ──────────────────────────────────
const LOCALES = ["vi", "en"] as const;
type Locale = (typeof LOCALES)[number];
const DEFAULT_LOCALE: Locale = "vi";

const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
  localeDetection: false,
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const ADMIN_PATHS = ["/admin"];
const PROTECTED_PATHS = ["/account", "/checkout"];

function localeFromPathname(pathname: string): Locale {
  const seg = pathname.split("/")[1] ?? "";
  return (LOCALES as readonly string[]).includes(seg)
    ? (seg as Locale)
    : DEFAULT_LOCALE;
}

async function getSession(
  request: NextRequest
): Promise<{ role?: string } | null> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;

  const isSecure = request.url.startsWith("https://");
  const secureName = "__Secure-authjs.session-token";
  const plainName = "authjs.session-token";
  const cookieName = isSecure ? secureName : plainName;

  const tokenValue =
    request.cookies.get(cookieName)?.value ??
    request.cookies.get(isSecure ? plainName : secureName)?.value;

  if (!tokenValue) return null;

  try {
    const payload = await decode({
      token: tokenValue,
      secret,
      salt: cookieName,
    });
    return payload as { role?: string } | null;
  } catch {
    return null;
  }
}

// ── Middleware ────────────────────────────────────────────────────────────────
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameWithoutLocale = pathname.replace(/^\/(vi|en)/, "");

  const isAdmin = ADMIN_PATHS.some((p) =>
    pathnameWithoutLocale.startsWith(p)
  );
  const isProtected = PROTECTED_PATHS.some((p) =>
    pathnameWithoutLocale.startsWith(p)
  );

  if (isAdmin || isProtected) {
    const session = await getSession(request);

    if (!session) {
      const locale = localeFromPathname(pathname);
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdmin && session.role !== "admin") {
      const locale = localeFromPathname(pathname);
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|_vercel|api|.*\\..*).*)"],
};
