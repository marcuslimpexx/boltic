// Client-side singleton: loads active products at build time
import productsJson from "@/lib/data/seed/products.json";
import type { Product } from "@/lib/data/types";
import { FuseSearchProvider } from "./fuse.provider";

const activeProducts = (productsJson as Product[]).filter(
  (p) => p.status === "active"
);

export const searchProvider = new FuseSearchProvider(activeProducts);
