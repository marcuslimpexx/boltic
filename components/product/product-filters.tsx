"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";

interface ProductFiltersProps {
  brands: string[];
  maxPrice?: number;
}

export function ProductFilters({
  brands,
  maxPrice = 2500000,
}: ProductFiltersProps) {
  const t = useTranslations("filters");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getParam = (key: string) => searchParams.get(key) ?? "";

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const toggleBrand = (brand: string) => {
    const current = getParam("brands").split(",").filter(Boolean);
    const next = current.includes(brand)
      ? current.filter((b) => b !== brand)
      : [...current, brand];
    updateParam("brands", next.join(",") || null);
  };

  const selectedBrands = getParam("brands").split(",").filter(Boolean);
  const minPrice = parseInt(getParam("minPrice") || "0", 10);
  const currentMaxPrice = parseInt(getParam("maxPrice") || String(maxPrice), 10);
  const fastCharging = getParam("fastCharging") === "true";
  const wirelessCharging = getParam("wirelessCharging") === "true";
  const minRating = parseFloat(getParam("minRating") || "0");

  const clearAll = () => {
    router.push(pathname);
  };

  const hasFilters =
    selectedBrands.length > 0 ||
    fastCharging ||
    wirelessCharging ||
    minRating > 0 ||
    !!getParam("minPrice") ||
    !!getParam("maxPrice");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">{t("title")}</h2>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-xs text-muted-foreground h-auto p-0 hover:text-destructive"
          >
            {t("clear_all")}
          </Button>
        )}
      </div>

      <Separator />

      {/* Brand */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">{t("brand")}</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="text-sm font-normal cursor-pointer"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price range */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">{t("price_range")}</h3>
        <Slider
          min={0}
          max={maxPrice}
          step={50000}
          value={[minPrice, currentMaxPrice]}
          onValueChange={([min, max]: [number, number]) => {
            const params = new URLSearchParams(searchParams.toString());
            if (min === 0) {
              params.delete("minPrice");
            } else {
              params.set("minPrice", String(min));
            }
            if (max === maxPrice) {
              params.delete("maxPrice");
            } else {
              params.set("maxPrice", String(max));
            }
            params.delete("page");
            router.push(`${pathname}?${params.toString()}`);
          }}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{(minPrice / 1000).toFixed(0)}k ₫</span>
          <span>{(currentMaxPrice / 1000).toFixed(0)}k ₫</span>
        </div>
      </div>

      <Separator />

      {/* Fast charging / Wireless */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="fast-charging"
            checked={fastCharging}
            onCheckedChange={(v) =>
              updateParam("fastCharging", v ? "true" : null)
            }
          />
          <Label htmlFor="fast-charging" className="text-sm font-normal cursor-pointer">
            {t("fast_charging")}
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="wireless-charging"
            checked={wirelessCharging}
            onCheckedChange={(v) =>
              updateParam("wirelessCharging", v ? "true" : null)
            }
          />
          <Label htmlFor="wireless-charging" className="text-sm font-normal cursor-pointer">
            {t("wireless_charging")}
          </Label>
        </div>
      </div>

      <Separator />

      {/* Minimum rating */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">{t("min_rating")}</h3>
        <div className="space-y-2">
          {([4, 3, 2] as const).map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() =>
                updateParam(
                  "minRating",
                  minRating === rating ? null : String(rating)
                )
              }
              className={`flex items-center gap-1 text-sm ${
                minRating === rating
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {Array.from({ length: rating }).map((_, i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span>& up</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
