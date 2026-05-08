import { ProductCard } from "./product-card";
import type { Product } from "@/lib/data/types";

interface ProductGridProps {
  products: Product[];
  locale: string;
}

export function ProductGrid({ products, locale }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        <p className="text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  );
}
