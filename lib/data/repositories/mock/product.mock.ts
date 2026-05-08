import type { IProductRepository } from "../interfaces/product.repository";
import type { Product, ProductFilters, PaginatedResult } from "@/lib/data/types";

export class MockProductRepository implements IProductRepository {
  async findAll(_filters?: ProductFilters): Promise<PaginatedResult<Product>> {
    return { items: [], total: 0, page: 1, pageSize: 24, totalPages: 0 };
  }
  async findBySlug(_slug: string): Promise<Product | null> { return null; }
  async findById(_id: string): Promise<Product | null> { return null; }
  async findByIds(_ids: string[]): Promise<Product[]> { return []; }
  async findRelated(_product: Product, _limit?: number): Promise<Product[]> { return []; }
  async getAllBrands(): Promise<string[]> { return []; }
}
