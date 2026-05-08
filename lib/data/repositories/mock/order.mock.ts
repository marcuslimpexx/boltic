import type { IOrderRepository, IReviewRepository, IWishlistRepository } from "../interfaces/order.repository";
import type { Order, OrderStatus, Review, WishlistItem } from "@/lib/data/types";

export class MockOrderRepository implements IOrderRepository {
  async findById(_id: string): Promise<Order | null> { return null; }
  async findByUserId(_userId: string, _status?: OrderStatus): Promise<Order[]> { return []; }
  async create(_order: Omit<Order, "id">): Promise<Order> { throw new Error("Not implemented"); }
  async updateStatus(
    _id: string,
    _status: OrderStatus,
    _extra?: Partial<Pick<Order,
      | "paidAt"
      | "fulfilledAt"
      | "deliveredAt"
      | "trackingNumber"
      | "trackingCourier"
      | "paymentRef"
      | "escrowReleaseAt"
    >>
  ): Promise<Order | null> { return null; }
}

export class MockReviewRepository implements IReviewRepository {
  async findByProductId(_productId: string): Promise<Review[]> { return []; }
  async findByUserId(_userId: string): Promise<Review[]> { return []; }
  async findByUserAndProduct(_userId: string, _productId: string): Promise<Review | null> { return null; }
  async create(_review: Omit<Review, "id" | "helpfulCount" | "reportedCount">): Promise<Review> { throw new Error("Not implemented"); }
  async markHelpful(_id: string): Promise<boolean> { return false; }
}

export class MockWishlistRepository implements IWishlistRepository {
  async findByUserId(_userId: string): Promise<WishlistItem[]> { return []; }
  async add(_userId: string, _productId: string): Promise<WishlistItem> { throw new Error("Not implemented"); }
  async remove(_userId: string, _productId: string): Promise<boolean> { return false; }
  async hasProduct(_userId: string, _productId: string): Promise<boolean> { return false; }
}
