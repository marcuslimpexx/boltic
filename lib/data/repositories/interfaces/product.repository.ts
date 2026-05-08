import type { Product, ProductFilters, PaginatedResult } from "@/lib/data/types";

export interface IProductRepository {
  findAll(filters?: ProductFilters): Promise<PaginatedResult<Product>>;
  findBySlug(slug: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
  findByIds(ids: string[]): Promise<Product[]>;
  findRelated(product: Product, limit?: number): Promise<Product[]>;
  getAllBrands(): Promise<string[]>;
}
