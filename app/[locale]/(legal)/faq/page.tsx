import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });
  return { title: t("faq") };
}

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Standard shipping takes 3–6 business days depending on your location and chosen carrier (GHN, GHTK, or ViettelPost). Remote areas may take longer.",
  },
  {
    q: "Is free shipping available?",
    a: "Yes! Orders over 1,000,000 ₫ qualify for free shipping across Vietnam.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept VietQR (bank transfer), MoMo, and ZaloPay. All transactions are secured.",
  },
  {
    q: "Can I return a product?",
    a: "Yes. You have 7 days from delivery to request a return for unused items in original packaging. See our Refund Policy for details.",
  },
  {
    q: "Are the products genuine?",
    a: "All products on Boltic are sourced from verified sellers and are 100% genuine with manufacturer warranties.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order ships, you'll receive a tracking number by email. You can also view your order status in My Account → My Orders.",
  },
  {
    q: "Can I cancel my order?",
    a: "Orders can be cancelled before they are shipped. Contact support@boltic.vn as soon as possible with your order number.",
  },
];

export default async function FaqPage({ params }: PageProps) {
  const { locale: _locale } = await params;
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-2xl font-bold mb-8">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-border pb-6 last:border-0">
            <h2 className="font-semibold text-base mb-2">{faq.q}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
