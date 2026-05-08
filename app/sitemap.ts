import type { MetadataRoute } from "next";
import { productRepo } from "@/lib/data";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://boltic.vn";
const LOCALES = ["vi", "en"] as const;

function localizedUrls(
  path: string,
  priority = 0.8
): MetadataRoute.Sitemap[number][] {
  return LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let allProducts = { items: [] as Awaited<ReturnType<typeof productRepo.findAll>>["items"] };
  try {
    allProducts = await productRepo.findAll({ pageSize: 1000 });
  } catch {
    // Database unavailable at build time — serve sitemap with static URLs only.
  }

  const productUrls: MetadataRoute.Sitemap = allProducts.items.flatMap(
    (product) =>
      LOCALES.map((locale) => ({
        url: `${BASE_URL}/${locale}/products/${product.slug}`,
        lastModified: new Date(product.updatedAt),
        changeFrequency: "daily" as const,
        priority: 0.9,
      }))
  );

  const staticPaths = [
    "",
    "/products",
    "/categories/power-banks",
    "/categories/compact",
    "/categories/standard",
    "/categories/high-capacity",
    "/categories/mega",
    "/faq",
    "/contact",
    "/legal/terms",
    "/legal/privacy",
    "/legal/refund",
    "/legal/shipping",
  ];

  const staticUrls = staticPaths.flatMap((path) =>
    localizedUrls(path, path === "" ? 1.0 : 0.7)
  );

  return [...staticUrls, ...productUrls];
}
