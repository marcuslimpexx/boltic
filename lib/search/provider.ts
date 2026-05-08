import type { Product } from "@/lib/data/types";

export interface SearchResult {
  product: Product;
  score: number;
}

export interface ISearchProvider {
  search(query: string, limit?: number): SearchResult[];
  isReady(): boolean;
}
