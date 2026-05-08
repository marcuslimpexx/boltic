import type { IWishlistRepository } from "../interfaces/order.repository";
import type { WishlistItem } from "@/lib/data/types";
import { prisma } from "@/lib/prisma";

function toWishlistItem(p: {
  id: string;
  userId: string;
  productId: string;
  addedAt: Date;
}): WishlistItem {
  return {
    id: p.id,
    userId: p.userId,
    productId: p.productId,
    addedAt: p.addedAt.toISOString(),
  };
}

export class PrismaWishlistRepository implements IWishlistRepository {
  async findByUserId(userId: string): Promise<WishlistItem[]> {
    const items = await prisma.wishlistItem.findMany({
      where: { userId },
      orderBy: { addedAt: "desc" },
    });
    return items.map(toWishlistItem);
  }

  async add(userId: string, productId: string): Promise<WishlistItem> {
    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) return toWishlistItem(existing);
    const created = await prisma.wishlistItem.create({
      data: { userId, productId },
    });
    return toWishlistItem(created);
  }

  async remove(userId: string, productId: string): Promise<boolean> {
    try {
      await prisma.wishlistItem.delete({
        where: { userId_productId: { userId, productId } },
      });
      return true;
    } catch {
      return false;
    }
  }

  async hasProduct(userId: string, productId: string): Promise<boolean> {
    const item = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    return item !== null;
  }
}
