import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { CheckoutForm } from "./checkout-form";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkout" });
  return { title: t("title") };
}

export default async function CheckoutPage({ params }: PageProps) {
  const { locale } = await params;
  return <CheckoutForm locale={locale} />;
}
