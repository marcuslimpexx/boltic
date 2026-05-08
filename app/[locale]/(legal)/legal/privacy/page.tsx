import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });
  return { title: t("privacy") };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale: _locale } = await params;
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl space-y-6 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: May 2026</p>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">1. Information We Collect</h2>
        <p>We collect information you provide directly: name, email address, phone number, delivery address, and payment information when you create an account or place an order.</p>
        <p>We also collect usage data automatically: pages visited, products viewed, search queries, and device/browser information.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">2. How We Use Your Information</h2>
        <p>We use your information to: process orders and payments, send order updates, improve the platform, prevent fraud, and comply with legal obligations. We do not sell your personal data to third parties.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">3. Cookies</h2>
        <p>We use essential cookies for authentication and session management, and analytics cookies to understand how users interact with the platform. You can disable non-essential cookies in your browser settings.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">4. Data Retention</h2>
        <p>We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data by contacting us.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">5. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal data. To exercise these rights, contact <a href="mailto:privacy@boltic.vn" className="text-primary underline">privacy@boltic.vn</a>.</p>
      </section>
    </div>
  );
}
