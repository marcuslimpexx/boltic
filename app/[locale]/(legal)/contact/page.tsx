import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });
  return { title: t("contact") };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale: _locale } = await params;
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">Contact Us</h1>
      <p className="text-sm text-muted-foreground mb-10">
        We&apos;re here to help. Reach out and we&apos;ll respond within 1 business day.
      </p>

      <div className="grid sm:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="font-semibold">Customer Support</h2>
            <p className="text-sm text-muted-foreground">For order issues, returns, and product questions</p>
            <a href="mailto:support@boltic.vn" className="text-sm text-primary underline">
              support@boltic.vn
            </a>
          </div>
          <div className="space-y-1">
            <h2 className="font-semibold">Seller Inquiries</h2>
            <p className="text-sm text-muted-foreground">Interested in selling on Boltic?</p>
            <a href="mailto:sellers@boltic.vn" className="text-sm text-primary underline">
              sellers@boltic.vn
            </a>
          </div>
          <div className="space-y-1">
            <h2 className="font-semibold">Legal & Privacy</h2>
            <a href="mailto:legal@boltic.vn" className="text-sm text-primary underline">
              legal@boltic.vn
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="font-semibold">Business Hours</h2>
            <p className="text-sm text-muted-foreground">Monday – Friday: 9:00 AM – 6:00 PM (ICT)</p>
            <p className="text-sm text-muted-foreground">Saturday: 9:00 AM – 12:00 PM (ICT)</p>
          </div>
          <div className="space-y-1">
            <h2 className="font-semibold">Operated by</h2>
            <p className="text-sm text-muted-foreground">PEXX Technology PTE Ltd</p>
            <p className="text-sm text-muted-foreground">Singapore</p>
          </div>
        </div>
      </div>
    </div>
  );
}
