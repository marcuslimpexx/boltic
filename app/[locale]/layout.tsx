import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SessionProvider } from "@/components/providers/session-provider";
import "../globals.css";

const sora = Sora({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sora",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: {
      default: t("title"),
      template: "%s | Boltic",
    },
    description: t("description"),
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
    ),
    alternates: {
      languages: {
        vi: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/vi`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/en`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "vi" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${sora.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
