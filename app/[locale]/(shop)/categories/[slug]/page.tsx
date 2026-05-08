import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { productRepo } from "@/lib/data";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductSort } from "@/components/product/product-sort";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

type CategoryKey = "power_banks" | "compact" | "standard" | "high_capacity" | "mega";

interface CategoryConfig {
  minCap?: number;
  maxCap?: number;
  labelKey: CategoryKey;
}

const CATEGORY_MAP: Record<string, CategoryConfig> = {
  "power-banks": { labelKey: "power_banks" },
  compact: { maxCap: 10000, labelKey: "compact" },
  standard: { minCap: 10001, maxCap: 20000, labelKey: "standard" },
  "high-capacity": { minCap: 20001, maxCap: 30000, labelKey: "high_capacity" },
  mega: { minCap: 30001, labelKey: "mega" },
};

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const cat = CATEGORY_MAP[slug];
  if (!cat) return {};
  const t = await getTranslations({ locale, namespace: "category" });
  return { title: t(cat.labelKey) };
}

function getStr(val: string | string[] | undefined, fallback = ""): string {
  if (Array.isArray(val)) return val[0] ?? fallback;
  return val ?? fallback;
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { locale, slug } = await params;
  const sp = await searchParams;
  const cat = CATEGORY_MAP[slug];
  if (!cat) notFound();

  const t = await getTranslations({ locale, namespace: "category" });

  const result = await productRepo.findAll({
    ...(cat.minCap !== undefined ? { minCapacityMah: cat.minCap } : {}),
    ...(cat.maxCap !== undefined ? { maxCapacityMah: cat.maxCap } : {}),
    page: sp["page"] ? parseInt(getStr(sp["page"]), 10) : 1,
    pageSize: 24,
    sort:
      (getStr(sp["sort"]) as
        | "relevance"
        | "newest"
        | "price_asc"
        | "price_desc"
        | "rating"
        | "best_selling") || "relevance",
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t(cat.labelKey)}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("products_count", { count: result.total })}
          </p>
        </div>
        <Suspense fallback={null}>
          <ProductSort />
        </Suspense>
      </div>

      {/* Capacity tier sub-nav for the top-level "power-banks" category */}
      {slug === "power-banks" && (
        <div className="flex gap-2 mb-8 flex-wrap">
          {(
            [
              { slug: "compact", key: "compact" as CategoryKey },
              { slug: "standard", key: "standard" as CategoryKey },
              { slug: "high-capacity", key: "high_capacity" as CategoryKey },
              { slug: "mega", key: "mega" as CategoryKey },
            ] as const
          ).map((tier) => (
            <Link
              key={tier.slug}
              href={`/categories/${tier.slug}`}
              className="px-4 py-1.5 rounded-full border border-border text-sm hover:border-primary hover:text-primary transition-colors"
            >
              {t(tier.key)}
            </Link>
          ))}
        </div>
      )}

      <ProductGrid products={result.items} locale={locale} />
    </div>
  );
}
