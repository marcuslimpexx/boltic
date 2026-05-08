import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { productRepo } from "@/lib/data";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductSort } from "@/components/product/product-sort";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductFilters as Filters } from "@/lib/data/types";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "category" });
  return {
    title: t("power_banks"),
    description:
      locale === "vi"
        ? "Mua pin dự phòng chính hãng tại Boltic. Anker, Baseus, Xiaomi và nhiều thương hiệu khác."
        : "Shop genuine power banks at Boltic. Anker, Baseus, Xiaomi and more.",
  };
}

function getStr(
  val: string | string[] | undefined,
  fallback = ""
): string {
  if (Array.isArray(val)) return val[0] ?? fallback;
  return val ?? fallback;
}

export default async function ProductsPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: "filters" });
  const tCategory = await getTranslations({ locale, namespace: "category" });

  const searchStr = getStr(sp["q"]);
  const brandsStr = getStr(sp["brands"]);
  const minPriceStr = getStr(sp["minPrice"]);
  const maxPriceStr = getStr(sp["maxPrice"]);
  const minRatingStr = getStr(sp["minRating"]);
  const pageStr = getStr(sp["page"]);
  const sortStr = getStr(sp["sort"]);

  const filters: Filters = {
    page: pageStr ? parseInt(pageStr, 10) : 1,
    pageSize: 24,
    sort: (sortStr as Filters["sort"]) || "relevance",
    ...(searchStr ? { search: searchStr } : {}),
    ...(brandsStr ? { brands: brandsStr.split(",").filter(Boolean) } : {}),
    ...(minPriceStr ? { minPrice: parseInt(minPriceStr, 10) } : {}),
    ...(maxPriceStr ? { maxPrice: parseInt(maxPriceStr, 10) } : {}),
    ...(minRatingStr ? { minRating: parseFloat(minRatingStr) } : {}),
    ...(sp["fastCharging"] === "true"
      ? { fastCharging: true }
      : sp["fastCharging"] === "false"
      ? { fastCharging: false }
      : {}),
    ...(sp["wirelessCharging"] === "true"
      ? { wirelessCharging: true }
      : sp["wirelessCharging"] === "false"
      ? { wirelessCharging: false }
      : {}),
  };

  const [result, brands] = await Promise.all([
    productRepo.findAll(filters),
    productRepo.getAllBrands(),
  ]);

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) {
      if (k !== "page" && v !== undefined) {
        params.set(k, Array.isArray(v) ? (v[0] ?? "") : v);
      }
    }
    params.set("page", String(page));
    return `/products?${params.toString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{tCategory("power_banks")}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("showing", { count: result.total })}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <Suspense fallback={null}>
            <ProductFilters brands={brands} />
          </Suspense>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="flex items-center justify-end mb-4">
            <Suspense fallback={null}>
              <ProductSort />
            </Suspense>
          </div>

          {/* Product grid */}
          <ProductGrid products={result.items} locale={locale} />

          {/* Pagination */}
          {result.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button
                variant="outline"
                size="icon"
                asChild
                disabled={result.page <= 1}
              >
                <Link href={buildHref(result.page - 1)} aria-label="Previous page">
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
              <span className="text-sm text-muted-foreground px-3">
                {result.page} / {result.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                asChild
                disabled={result.page >= result.totalPages}
              >
                <Link href={buildHref(result.page + 1)} aria-label="Next page">
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
