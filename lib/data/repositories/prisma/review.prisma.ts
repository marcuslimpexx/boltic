import type { IReviewRepository } from "../interfaces/order.repository";
import type { Review, ReviewStatus } from "@/lib/data/types";
import { prisma } from "@/lib/prisma";

type PrismaReview = {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string | null;
  photos: unknown;
  verifiedPurchase: boolean;
  helpfulCount: number;
  reportedCount: number;
  status: string;
  createdAt: Date;
};

function toReview(p: PrismaReview): Review {
  return {
    id: p.id,
    productId: p.productId,
    userId: p.userId,
    userName: p.userName,
    rating: p.rating,
    text: p.text,
    photos: p.photos as string[],
    verifiedPurchase: p.verifiedPurchase,
    helpfulCount: p.helpfulCount,
    reportedCount: p.reportedCount,
    status: p.status as ReviewStatus,
    createdAt: p.createdAt.toISOString(),
  };
}

export class PrismaReviewRepository implements IReviewRepository {
  async findByProductId(productId: string): Promise<Review[]> {
    const reviews = await prisma.review.findMany({
      where: { productId, status: "published" },
      orderBy: { createdAt: "desc" },
    });
    return reviews.map(toReview);
  }

  async findByUserId(userId: string): Promise<Review[]> {
    const reviews = await prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return reviews.map(toReview);
  }

  async findByUserAndProduct(userId: string, productId: string): Promise<Review | null> {
    const review = await prisma.review.findFirst({
      where: { userId, productId },
    });
    return review ? toReview(review) : null;
  }

  async create(review: Omit<Review, "id" | "helpfulCount" | "reportedCount">): Promise<Review> {
    const created = await prisma.review.create({
      data: {
        productId: review.productId,
        userId: review.userId,
        userName: review.userName,
        rating: review.rating,
        text: review.text ?? null,
        photos: review.photos,
        verifiedPurchase: review.verifiedPurchase,
        status: review.status,
        createdAt: new Date(review.createdAt),
      },
    });
    return toReview(created);
  }

  async markHelpful(id: string): Promise<boolean> {
    try {
      await prisma.review.update({
        where: { id },
        data: { helpfulCount: { increment: 1 } },
      });
      return true;
    } catch {
      return false;
    }
  }
}
