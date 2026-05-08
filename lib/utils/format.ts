/**
 * Format a VND price for display: 1.250.000 ₫
 * Vietnamese convention uses dots as thousands separators.
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a discount percentage: e.g. -18%
 */
export function formatDiscount(price: number, compareAtPrice: number): string {
  const pct = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  return `-${pct}%`;
}
