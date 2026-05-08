import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AddToCartButton } from "./add-to-cart-button";
import { WishlistButton } from "./wishlist-button";
import { formatVND, formatDiscount } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/data/types";

interface ProductCardProps {
  product: Product;
  locale: string;
  className?: string;
}

export function ProductCard({ product, locale, className }: ProductCardProps) {
  const name = locale === "vi" ? product.name.vi : product.name.en;
  const primaryImage = product.images[0] ?? "/placeholder-product.jpg";
  const isOnSale =
    product.compareAtPrice !== null && product.compareAtPrice > product.price;
  const isOutOfStock = product.status === "out_of_stock";

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border border-border hover:border-primary/30 transition-all duration-200",
        className
      )}
    >
      {/* Wishlist button */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <WishlistButton productId={product.id} size="sm" />
      </div>

      {/* Sale badge */}
      {isOnSale && product.compareAtPrice !== null && (
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-red-500 text-white text-xs">
            {formatDiscount(product.price, product.compareAtPrice)}
          </Badge>
        </div>
      )}

      {/* Product image */}
      <Link href={`/products/${product.slug}`} className="block aspect-square overflow-hidden bg-secondary">
        <Image
          src={primaryImage}
          alt={name}
          width={400}
          height={400}
          className={cn(
            "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
            isOutOfStock && "opacity-60"
          )}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </Link>

      <CardContent className="p-3 space-y-2">
        {/* Brand */}
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {product.brand}
        </p>

        {/* Product name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {product.ratingCount > 0 && (
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">
              {product.ratingAvg.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">({product.ratingCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "text-base font-bold",
              isOutOfStock ? "text-muted-foreground" : "text-foreground"
            )}
          >
            {formatVND(product.price)}
          </span>
          {isOnSale && product.compareAtPrice !== null && (
            <span className="text-xs text-muted-foreground line-through">
              {formatVND(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Out of stock indicator */}
        {isOutOfStock && (
          <p className="text-xs text-red-500 font-medium">Out of stock</p>
        )}

        {/* Add to cart */}
        {!isOutOfStock && (
          <AddToCartButton
            productId={product.id}
            slug={product.slug}
            name={product.name.en}
            image={primaryImage}
            price={product.price}
            label="Add to cart"
            variant="outline"
            className="w-full text-xs h-8 mt-1"
          />
        )}
      </CardContent>
    </Card>
  );
}
