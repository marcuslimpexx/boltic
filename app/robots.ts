import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://boltic.vn";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/account/", "/checkout/", "/orders/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
