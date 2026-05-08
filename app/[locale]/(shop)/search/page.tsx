import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { productRepo } from "@/lib/data";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductSort } from "@/components/product/product-sort";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;
  const q = Array.isArray(sp["q"]) ? sp["q"][0] : sp["q"];
  const t = await getTranslations({ locale, namespace: "search" });
  return {
    title: q ? t("results_for", { query: q }) : t("placeholder"),
  };
}

function getStr(val: string | string[] | undefined, fallback = ""): string {
  if (Array.isArray(val)) return val[0] ?? fallback;
  return val ?? fallback;
}

export default async function SearchPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  const query = getStr(sp["q"]);
  const t = await getTranslations({ locale, namespace: "search" });

  const result = await productRepo.findAll({
    ...(query ? { search: query } : {}),
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
          {query ? (
            <h1 className="text-2xl font-bold">
              {t("results_for", { query })}
            </h1>
          ) : (
            <h1 className="text-2xl font-bold">{t("placeholder")}</h1>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            {t("result_count", { count: result.total })}
          </p>
        </div>
        <Suspense fallback={null}>
          <ProductSort />
        </Suspense>
      </div>

      <ProductGrid products={result.items} locale={locale} />
    </div>
  );
}
