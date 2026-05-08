import Fuse, { type IFuseOptions } from "fuse.js";
import type { ISearchProvider, SearchResult } from "./provider";
import type { Product } from "@/lib/data/types";

const FUSE_OPTIONS: IFuseOptions<Product> = {
  keys: [
    { name: "name.en", weight: 2 },
    { name: "name.vi", weight: 2 },
    { name: "brand", weight: 1.5 },
    { name: "description.en", weight: 0.5 },
    { name: "description.vi", weight: 0.5 },
  ],
  threshold: 0.35,
  includeScore: true,
  minMatchCharLength: 2,
};

export class FuseSearchProvider implements ISearchProvider {
  private fuse: Fuse<Product> | null = null;

  constructor(products: Product[]) {
    this.fuse = new Fuse(products, FUSE_OPTIONS);
  }

  search(query: string, limit = 6): SearchResult[] {
    if (!this.fuse || !query.trim()) return [];
    return this.fuse.search(query, { limit }).map((result) => ({
      product: result.item,
      score: result.score ?? 1,
    }));
  }

  isReady(): boolean {
    return this.fuse !== null;
  }
}
