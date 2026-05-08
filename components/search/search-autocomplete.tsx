"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { formatVND } from "@/lib/utils/format";
import type { SearchResult } from "@/lib/search/provider";

interface SearchAutocompleteProps {
  results: SearchResult[];
  query: string;
  onClose: () => void;
  locale: string;
}

export function SearchAutocomplete({
  results,
  query,
  onClose,
  locale,
}: SearchAutocompleteProps) {
  const t = useTranslations("search");

  if (!query.trim()) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
      {results.length === 0 ? (
        <p className="px-4 py-3 text-sm text-muted-foreground">{t("no_results")}</p>
      ) : (
        <>
          <ul>
            {results.map(({ product }) => {
              const name = locale === "vi" ? product.name.vi : product.name.en;
              const image = product.images[0] ?? "/placeholder-product.jpg";
              return (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary transition-colors"
                  >
                    <Image
                      src={image}
                      alt={name}
                      width={40}
                      height={40}
                      className="rounded object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{name}</p>
                      <p className="text-xs text-muted-foreground">{product.brand}</p>
                    </div>
                    <span className="text-sm font-semibold shrink-0">
                      {formatVND(product.price)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            onClick={onClose}
            className="block px-4 py-2.5 text-sm text-primary font-medium hover:bg-secondary border-t border-border transition-colors"
          >
            {t("see_all", { query })}
          </Link>
        </>
      )}
    </div>
  );
}
