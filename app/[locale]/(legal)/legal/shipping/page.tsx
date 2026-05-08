import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });
  return { title: t("shipping_policy") };
}

export default async function ShippingPage({ params }: PageProps) {
  const { locale: _locale } = await params;
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl space-y-6 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold">Shipping Policy</h1>
      <p className="text-muted-foreground">Last updated: May 2026</p>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Free Shipping</h2>
        <p>Orders over 1,000,000 ₫ qualify for free standard shipping anywhere in Vietnam.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Shipping Carriers & Rates</h2>
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-3 font-medium">Carrier</th>
                <th className="text-left p-3 font-medium">Delivery Time</th>
                <th className="text-left p-3 font-medium">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="p-3">GHN</td><td className="p-3">3–5 business days</td><td className="p-3">25,000 ₫</td></tr>
              <tr><td className="p-3">GHTK</td><td className="p-3">4–6 business days</td><td className="p-3">20,000 ₫</td></tr>
              <tr><td className="p-3">ViettelPost</td><td className="p-3">3–5 business days</td><td className="p-3">22,000 ₫</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Processing Time</h2>
        <p>Orders are processed within 1 business day. You will receive a tracking number by email once your order ships.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Delivery Areas</h2>
        <p>We ship to all provinces and cities across Vietnam. Remote areas may experience longer delivery times.</p>
      </section>
    </div>
  );
}
