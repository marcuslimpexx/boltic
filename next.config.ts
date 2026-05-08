import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/config.ts");

const nextConfig: NextConfig = {
  // Keep Prisma out of the Turbopack server bundle so that new PrismaClient()
  // is never called at build-time when DATABASE_URL is absent.
  serverExternalPackages: [
    "@prisma/client",
    ".prisma/client",
    "@prisma/adapter-pg",
    "pg",
    "pg-pool",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
