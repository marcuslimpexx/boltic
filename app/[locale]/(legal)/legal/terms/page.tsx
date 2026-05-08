import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });
  return { title: t("terms") };
}

export default async function TermsPage({ params }: PageProps) {
  const { locale: _locale } = await params;
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl space-y-6 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold">Terms of Service</h1>
      <p className="text-muted-foreground">Last updated: May 2026</p>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
        <p>By accessing and using Boltic, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this platform.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">2. Use of the Platform</h2>
        <p>Boltic is a marketplace for portable power products in Vietnam. Users may browse, purchase, and review products listed by verified sellers. You agree to use the platform only for lawful purposes and in a manner that does not infringe the rights of others.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">3. User Accounts</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Notify us immediately at <a href="mailto:support@boltic.vn" className="text-primary underline">support@boltic.vn</a> of any unauthorized use.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">4. Payments & Pricing</h2>
        <p>All prices are listed in Vietnamese Dong (VND). Payments are processed at the time of order placement through secure third-party payment gateways (VietQR, MoMo, ZaloPay). Boltic is not liable for errors introduced by these services.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">5. Returns & Refunds</h2>
        <p>Returns are accepted within 7 days of delivery for unused items in original packaging. Please review our <a href="/legal/refund" className="text-primary underline">Refund Policy</a> for full details.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">6. Limitation of Liability</h2>
        <p>Boltic and its operators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform or products purchased through it.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">7. Governing Law</h2>
        <p>These terms are governed by the laws of the Socialist Republic of Vietnam. Any disputes shall be resolved in Vietnamese courts.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">8. Contact</h2>
        <p>For questions about these Terms, contact us at <a href="mailto:legal@boltic.vn" className="text-primary underline">legal@boltic.vn</a>.</p>
      </section>
    </div>
  );
}
