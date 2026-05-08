import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth/config";
import { wishlistRepo, productRepo } from "@/lib/data";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wishlist" });
  return { title: t("title") };
}

export default async function WishlistPage({ params }: PageProps) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const [wishlistItems, t] = await Promise.all([
    wishlistRepo.findByUserId(session.user.id),
    getTranslations({ locale, namespace: "wishlist" }),
  ]);

  const products = await productRepo.findByIds(
    wishlistItems.map((w) => w.productId)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {t("item_count", { count: products.length })}
      </p>

      {products.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <p className="text-muted-foreground">{t("empty")}</p>
          <p className="text-sm text-muted-foreground">{t("empty_desc")}</p>
          <Button asChild>
            <Link href="/products">Shop now</Link>
          </Button>
        </div>
      ) : (
        <ProductGrid products={products} locale={locale} />
      )}
    </div>
  );
}
