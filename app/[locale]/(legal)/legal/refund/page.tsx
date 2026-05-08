import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });
  return { title: t("refund") };
}

export default async function RefundPage({ params }: PageProps) {
  const { locale: _locale } = await params;
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl space-y-6 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold">Refund Policy</h1>
      <p className="text-muted-foreground">Last updated: May 2026</p>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Return Window</h2>
        <p>You have 7 calendar days from the date of delivery to request a return. Items must be unused, in their original packaging, and accompanied by proof of purchase.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Eligible Items</h2>
        <p>Most products are eligible for return. The following are not eligible: items damaged by misuse, items without original packaging, or items specifically marked as non-returnable.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">How to Request a Return</h2>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Contact <a href="mailto:returns@boltic.vn" className="text-primary underline">returns@boltic.vn</a> with your order number and reason.</li>
          <li>We will provide a return shipping label within 2 business days.</li>
          <li>Ship the item back using the provided label.</li>
          <li>Once received and inspected, your refund will be processed within 5–7 business days.</li>
        </ol>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Refund Method</h2>
        <p>Refunds are issued to the original payment method. Bank transfers may take 3–5 additional business days depending on your bank.</p>
      </section>
    </div>
  );
}
