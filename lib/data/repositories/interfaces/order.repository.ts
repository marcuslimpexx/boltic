import type { Order, OrderStatus, Review, WishlistItem } from "@/lib/data/types";

export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string, status?: OrderStatus): Promise<Order[]>;
  create(order: Omit<Order, "id">): Promise<Order>;
  updateStatus(
    id: string,
    status: OrderStatus,
    extra?: Partial<Pick<Order,
      | "paidAt"
      | "fulfilledAt"
      | "deliveredAt"
      | "trackingNumber"
      | "trackingCourier"
      | "paymentRef"
      | "escrowReleaseAt"
    >>
  ): Promise<Order | null>;
}

export interface IReviewRepository {
  findByProductId(productId: string): Promise<Review[]>;
  findByUserId(userId: string): Promise<Review[]>;
  findByUserAndProduct(userId: string, productId: string): Promise<Review | null>;
  create(
    review: Omit<Review, "id" | "helpfulCount" | "reportedCount">
  ): Promise<Review>;
  markHelpful(id: string): Promise<boolean>;
}

export interface IWishlistRepository {
  findByUserId(userId: string): Promise<WishlistItem[]>;
  add(userId: string, productId: string): Promise<WishlistItem>;
  remove(userId: string, productId: string): Promise<boolean>;
  hasProduct(userId: string, productId: string): Promise<boolean>;
}
