"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption =
  | "relevance"
  | "newest"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "best_selling";

const SORT_OPTIONS: SortOption[] = [
  "relevance",
  "newest",
  "price_asc",
  "price_desc",
  "rating",
  "best_selling",
];

export function ProductSort() {
  const t = useTranslations("sort");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = (searchParams.get("sort") ?? "relevance") as SortOption;

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">{t("label")}:</span>
      <Select value={currentSort} onValueChange={handleSort}>
        <SelectTrigger className="w-44 h-9 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {t(opt)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
