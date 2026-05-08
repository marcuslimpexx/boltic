import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Script from "next/script";
import { productRepo, sellerRepo } from "@/lib/data";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductSpecsTable } from "@/components/product/product-specs-table";
import { ProductBreadcrumb } from "@/components/product/product-breadcrumb";
import { RelatedProducts } from "@/components/product/related-products";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { WishlistButton } from "@/components/product/wishlist-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Zap, Wifi } from "lucide-react";
import { formatVND, formatDiscount } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await productRepo.findBySlug(slug);
  if (!product) return {};

  const name = locale === "vi" ? product.name.vi : product.name.en;
  const description =
    locale === "vi" ? product.description.vi : product.description.en;
  const image = product.images[0];

  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description,
      images: image ? [{ url: image, width: 800, height: 800 }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const product = await productRepo.findBySlug(slug);
  if (!product) notFound();

  const [seller, t, tProduct] = await Promise.all([
    sellerRepo.findById(product.sellerId),
    getTranslations({ locale, namespace: "product_detail" }),
    getTranslations({ locale, namespace: "product" }),
  ]);

  const name = locale === "vi" ? product.name.vi : product.name.en;
  const description =
    locale === "vi" ? product.description.vi : product.description.en;
  const isOnSale =
    product.compareAtPrice !== null && product.compareAtPrice > product.price;
  const isOutOfStock = product.status === "out_of_stock";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    brand: { "@type": "Brand", name: product.brand },
    image: product.images,
    sku: product.id,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "VND",
      availability: isOutOfStock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
    ...(product.ratingCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.ratingAvg,
        reviewCount: product.ratingCount,
      },
    }),
  };

  return (
    <>
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-6">
        <ProductBreadcrumb productName={name} locale={locale} />

        <div className="mt-6 grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <ProductGallery images={product.images} productName={name} />

          {/* Product info */}
          <div className="space-y-5">
            <p className="text-sm text-primary font-semibold uppercase tracking-wider">
              {product.brand}
            </p>

            <h1 className="text-2xl lg:text-3xl font-bold leading-tight">{name}</h1>

            {product.ratingCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(product.ratingAvg)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-border"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">
                  {product.ratingAvg.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({product.ratingCount} {tProduct("reviews").toLowerCase()})
                </span>
              </div>
            )}

            <div className="flex items-baseline gap-3">
              <span
                className={cn(
                  "text-3xl font-bold",
                  isOutOfStock ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {formatVND(product.price)}
              </span>
              {isOnSale && product.compareAtPrice !== null && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatVND(product.compareAtPrice)}
                  </span>
                  <Badge className="bg-red-500 text-white">
                    {formatDiscount(product.price, product.compareAtPrice)}
                  </Badge>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {product.attributes.capacityMah.toLocaleString()} mAh
              </Badge>
              <Badge variant="secondary">{product.attributes.outputWatts}W</Badge>
              {product.attributes.fastCharging && (
                <Badge className="bg-yellow-100 text-yellow-800 gap-1">
                  <Zap className="h-3 w-3" />
                  Fast charge
                </Badge>
              )}
              {product.attributes.wirelessCharging && (
                <Badge className="bg-blue-100 text-blue-800 gap-1">
                  <Wifi className="h-3 w-3" />
                  Wireless
                </Badge>
              )}
            </div>

            <p
              className={cn(
                "text-sm font-medium",
                isOutOfStock ? "text-red-500" : "text-green-600"
              )}
            >
              {isOutOfStock ? tProduct("out_of_stock") : tProduct("in_stock")}
            </p>

            {seller && (
              <p className="text-xs text-muted-foreground">
                {t("sold_by")}{" "}
                <span className="font-medium text-foreground">
                  {seller.displayName}
                </span>
              </p>
            )}

            <Separator />

            <div className="flex gap-3">
              <AddToCartButton
                productId={product.id}
                slug={product.slug}
                name={product.name.en}
                image={product.images[0] ?? ""}
                price={product.price}
                label={tProduct("add_to_cart")}
                className="flex-1"
                disabled={isOutOfStock}
              />
              <WishlistButton productId={product.id} />
            </div>

            {!isOutOfStock && (
              <AddToCartButton
                productId={product.id}
                slug={product.slug}
                name={product.name.en}
                image={product.images[0] ?? ""}
                price={product.price}
                label={tProduct("buy_now")}
                variant="outline"
                className="w-full"
              />
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="mb-6">
              <TabsTrigger value="description">{tProduct("description")}</TabsTrigger>
              <TabsTrigger value="specs">{tProduct("specifications")}</TabsTrigger>
              <TabsTrigger value="shipping">{tProduct("shipping_returns")}</TabsTrigger>
              <TabsTrigger value="reviews">
                {tProduct("reviews")} ({product.ratingCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="text-sm leading-relaxed">
              <p>{description}</p>
            </TabsContent>

            <TabsContent value="specs">
              <Suspense fallback={null}>
                <ProductSpecsTable product={product} locale={locale} />
              </Suspense>
            </TabsContent>

            <TabsContent value="shipping" className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>Free shipping on orders over 1,000,000 ₫.</p>
              <p>Standard delivery: 3–5 business days (GHN / GHTK / ViettelPost).</p>
              <p>7-day return window from delivery. Items must be unused and in original packaging.</p>
            </TabsContent>

            <TabsContent value="reviews" className="text-sm">
              {product.ratingCount === 0 ? (
                <p className="text-muted-foreground">{t("no_reviews")}</p>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-5xl font-bold">{product.ratingAvg.toFixed(1)}</p>
                    <div className="flex items-center justify-center gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < Math.floor(product.ratingAvg)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-border"
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {product.ratingCount} reviews
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <Suspense fallback={null}>
          <RelatedProducts product={product} locale={locale} />
        </Suspense>
      </div>
    </>
  );
}
