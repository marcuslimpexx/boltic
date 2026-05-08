import type { IProductRepository } from "../interfaces/product.repository";
import type {
  Product,
  ProductFilters,
  PaginatedResult,
  ProductAttributes,
  ProductStatus,
} from "@/lib/data/types";
import { prisma } from "@/lib/prisma";

type PrismaProduct = {
  id: string;
  slug: string;
  nameEn: string;
  nameVi: string;
  descriptionEn: string;
  descriptionVi: string;
  brand: string;
  sellerId: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  images: unknown;
  attributes: unknown;
  stock: number;
  status: string;
  ratingAvg: number;
  ratingCount: number;
  salesCount: number;
  createdAt: Date;
  updatedAt: Date;
};

function toProduct(p: PrismaProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: { en: p.nameEn, vi: p.nameVi },
    description: { en: p.descriptionEn, vi: p.descriptionVi },
    brand: p.brand,
    sellerId: p.sellerId,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    currency: "VND",
    images: p.images as string[],
    attributes: p.attributes as ProductAttributes,
    stock: p.stock,
    status: p.status as ProductStatus,
    ratingAvg: p.ratingAvg,
    ratingCount: p.ratingCount,
    salesCount: p.salesCount,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export class PrismaProductRepository implements IProductRepository {
  async findAll(filters?: ProductFilters): Promise<PaginatedResult<Product>> {
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};

    if (filters?.status) {
      where["status"] = filters.status;
    }
    if (filters?.brands && filters.brands.length > 0) {
      where["brand"] = { in: filters.brands };
    }
    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where["price"] = {
        ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
        ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
      };
    }
    if (filters?.minRating !== undefined) {
      where["ratingAvg"] = { gte: filters.minRating };
    }
    if (filters?.search) {
      where["OR"] = [
        { nameEn: { contains: filters.search, mode: "insensitive" } },
        { nameVi: { contains: filters.search, mode: "insensitive" } },
        { brand: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const orderBy = (() => {
      switch (filters?.sort) {
        case "newest":
          return { createdAt: "desc" as const };
        case "price_asc":
          return { price: "asc" as const };
        case "price_desc":
          return { price: "desc" as const };
        case "rating":
          return { ratingAvg: "desc" as const };
        case "best_selling":
          return { salesCount: "desc" as const };
        default:
          return { createdAt: "desc" as const };
      }
    })();

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        where: where as any,
        orderBy,
        skip,
        take: pageSize,
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prisma.product.count({ where: where as any }),
    ]);

    return {
      items: items.map(toProduct),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const p = await prisma.product.findUnique({ where: { slug } });
    return p ? toProduct(p) : null;
  }

  async findById(id: string): Promise<Product | null> {
    const p = await prisma.product.findUnique({ where: { id } });
    return p ? toProduct(p) : null;
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: { id: { in: ids } },
    });
    return products.map(toProduct);
  }

  async findRelated(product: Product, limit = 4): Promise<Product[]> {
    const related = await prisma.product.findMany({
      where: {
        brand: product.brand,
        id: { not: product.id },
        status: "active",
      },
      take: limit,
      orderBy: { ratingAvg: "desc" },
    });

    if (related.length < limit) {
      const more = await prisma.product.findMany({
        where: {
          id: { notIn: [product.id, ...related.map((r) => r.id)] },
          status: "active",
        },
        take: limit - related.length,
        orderBy: { ratingAvg: "desc" },
      });
      return [...related, ...more].map(toProduct);
    }

    return related.map(toProduct);
  }

  async getAllBrands(): Promise<string[]> {
    const result = await prisma.product.findMany({
      select: { brand: true },
      distinct: ["brand"],
      where: { status: "active" },
      orderBy: { brand: "asc" },
    });
    return result.map((r) => r.brand);
  }
}
