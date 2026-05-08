import type { IProductRepository } from "../interfaces/product.repository";
import type { Product, ProductFilters, PaginatedResult } from "@/lib/data/types";
import productsJson from "@/lib/data/seed/products.json";

const products = productsJson as Product[];

export class MockProductRepository implements IProductRepository {
  async findAll(filters: ProductFilters = {}): Promise<PaginatedResult<Product>> {
    let results = products.filter((p) => p.status === "active");

    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.en.toLowerCase().includes(q) ||
          p.name.vi.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }
    if (filters.brands && filters.brands.length > 0) {
      results = results.filter((p) => filters.brands!.includes(p.brand));
    }
    if (filters.minPrice !== undefined) {
      results = results.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters.minCapacityMah !== undefined) {
      results = results.filter(
        (p) => p.attributes.capacityMah >= filters.minCapacityMah!
      );
    }
    if (filters.maxCapacityMah !== undefined) {
      results = results.filter(
        (p) => p.attributes.capacityMah <= filters.maxCapacityMah!
      );
    }
    if (filters.fastCharging !== undefined) {
      results = results.filter(
        (p) => p.attributes.fastCharging === filters.fastCharging
      );
    }
    if (filters.wirelessCharging !== undefined) {
      results = results.filter(
        (p) => p.attributes.wirelessCharging === filters.wirelessCharging
      );
    }
    if (filters.outputPorts && filters.outputPorts.length > 0) {
      results = results.filter((p) =>
        filters.outputPorts!.some((port) =>
          p.attributes.outputPorts.includes(port)
        )
      );
    }
    if (filters.minRating !== undefined) {
      results = results.filter((p) => p.ratingAvg >= filters.minRating!);
    }

    // Sort
    const sorted = [...results];
    switch (filters.sort) {
      case "newest":
        sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case "price_asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.ratingAvg - a.ratingAvg);
        break;
      case "best_selling":
        sorted.sort((a, b) => b.salesCount - a.salesCount);
        break;
      default:
        // relevance: by ratingCount desc
        sorted.sort((a, b) => b.ratingCount - a.ratingCount);
    }

    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 24;
    const total = sorted.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const items = sorted.slice(start, start + pageSize);

    return { items, total, page, pageSize, totalPages };
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return products.find((p) => p.slug === slug) ?? null;
  }

  async findById(id: string): Promise<Product | null> {
    return products.find((p) => p.id === id) ?? null;
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    return products.filter((p) => ids.includes(p.id));
  }

  async findRelated(product: Product, limit = 4): Promise<Product[]> {
    return products
      .filter(
        (p) =>
          p.id !== product.id &&
          p.status === "active" &&
          (p.brand === product.brand ||
            Math.abs(
              p.attributes.capacityMah - product.attributes.capacityMah
            ) <= 5000)
      )
      .slice(0, limit);
  }

  async getAllBrands(): Promise<string[]> {
    return [...new Set(products.map((p) => p.brand))].sort();
  }
}
