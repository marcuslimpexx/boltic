import { productRepo } from "@/lib/data";
import { ProductCard } from "./product-card";
import { getTranslations } from "next-intl/server";
import type { Product } from "@/lib/data/types";

interface RelatedProductsProps {
  product: Product;
  locale: string;
}

export async function RelatedProducts({
  product,
  locale,
}: RelatedProductsProps) {
  const [related, t] = await Promise.all([
    productRepo.findRelated(product, 4),
    getTranslations({ locale, namespace: "product" }),
  ]);

  if (related.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">{t("related")}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} locale={locale} />
        ))}
      </div>
    </section>
  );
}
