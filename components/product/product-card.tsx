import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Star, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

  const capacityMah = product.attributes.capacityMah;

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-surface rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300",
        className
      )}
    >
      {/* Image container */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-secondary"
      >
        <Image
          src={primaryImage}
          alt={name}
          width={400}
          height={400}
          className={cn(
            "w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]",
            isOutOfStock && "opacity-50 grayscale"
          )}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {isOnSale && product.compareAtPrice !== null && (
            <Badge
              className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow"
            >
              {formatDiscount(product.price, product.compareAtPrice)}
            </Badge>
          )}
          {isOutOfStock && (
            <Badge
              variant="secondary"
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded shadow"
            >
              {locale === "vi" ? "Hết hàng" : "Sold out"}
            </Badge>
          )}
        </div>

        {/* Wishlist — appears on hover */}
        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
          <WishlistButton productId={product.id} size="sm" />
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3.5 gap-2">
        {/* Brand + capacity */}
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {product.brand}
          </p>
          {capacityMah > 0 && (
            <span className="text-[10px] font-mono font-semibold text-primary bg-primary/8 px-1.5 py-0.5 rounded">
              {capacityMah.toLocaleString()} mAh
            </span>
          )}
        </div>

        {/* Name */}
        <Link href={`/products/${product.slug}`} className="flex-1">
          <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {product.ratingCount > 0 && (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-3 w-3",
                  star <= Math.round(product.ratingAvg)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-none text-border"
                )}
              />
            ))}
            <span className="text-[11px] text-muted-foreground ml-0.5">
              ({product.ratingCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span
            className={cn(
              "text-base font-bold",
              isOnSale ? "text-primary" : "text-foreground",
              isOutOfStock && "text-muted-foreground"
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

        {/* Add to cart */}
        {!isOutOfStock && (
          <AddToCartButton
            productId={product.id}
            slug={product.slug}
            name={product.name.en}
            image={primaryImage}
            price={product.price}
            label={locale === "vi" ? "Thêm vào giỏ" : "Add to cart"}
            variant="outline"
            className="w-full text-xs h-8 mt-0.5 border-border hover:border-primary hover:text-primary transition-colors"
          />
        )}
      </div>
    </div>
  );
}
