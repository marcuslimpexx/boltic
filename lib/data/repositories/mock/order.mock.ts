// Use Web Crypto API (works in both Node.js and Edge Runtime)
const randomUUID = () => globalThis.crypto.randomUUID();
import type {
  IOrderRepository,
  IReviewRepository,
  IWishlistRepository,
} from "../interfaces/order.repository";
import type { Order, OrderStatus, Review, WishlistItem } from "@/lib/data/types";

// ─── Orders ───────────────────────────────────────────────────────────────────

const orders: Order[] = [];

export class MockOrderRepository implements IOrderRepository {
  async findById(id: string): Promise<Order | null> {
    return orders.find((o) => o.id === id) ?? null;
  }

  async findByUserId(userId: string, status?: OrderStatus): Promise<Order[]> {
    return orders.filter(
      (o) => o.userId === userId && (status === undefined || o.status === status)
    );
  }

  async create(data: Omit<Order, "id">): Promise<Order> {
    const order: Order = { ...data, id: `ord-${randomUUID()}` };
    orders.push(order);
    return order;
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    extra?: Partial<
      Pick<
        Order,
        | "paidAt"
        | "fulfilledAt"
        | "deliveredAt"
        | "trackingNumber"
        | "trackingCourier"
        | "paymentRef"
        | "escrowReleaseAt"
      >
    >
  ): Promise<Order | null> {
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    const existing = orders[idx];
    if (!existing) return null;
    const updated: Order = { ...existing, status, ...(extra ?? {}) };
    orders[idx] = updated;
    return updated;
  }
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

const reviews: Review[] = [];

export class MockReviewRepository implements IReviewRepository {
  async findByProductId(productId: string): Promise<Review[]> {
    return reviews.filter(
      (r) => r.productId === productId && r.status === "published"
    );
  }

  async findByUserId(userId: string): Promise<Review[]> {
    return reviews.filter((r) => r.userId === userId);
  }

  async findByUserAndProduct(
    userId: string,
    productId: string
  ): Promise<Review | null> {
    return (
      reviews.find((r) => r.userId === userId && r.productId === productId) ??
      null
    );
  }

  async create(
    data: Omit<Review, "id" | "helpfulCount" | "reportedCount">
  ): Promise<Review> {
    const review: Review = {
      ...data,
      id: randomUUID(),
      helpfulCount: 0,
      reportedCount: 0,
    };
    reviews.push(review);
    return review;
  }

  async markHelpful(id: string): Promise<boolean> {
    const r = reviews.find((review) => review.id === id);
    if (!r) return false;
    r.helpfulCount += 1;
    return true;
  }
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

const wishlistItems: WishlistItem[] = [];

export class MockWishlistRepository implements IWishlistRepository {
  async findByUserId(userId: string): Promise<WishlistItem[]> {
    return wishlistItems.filter((w) => w.userId === userId);
  }

  async add(userId: string, productId: string): Promise<WishlistItem> {
    const existing = wishlistItems.find(
      (w) => w.userId === userId && w.productId === productId
    );
    if (existing) return existing;
    const item: WishlistItem = {
      id: randomUUID(),
      userId,
      productId,
      addedAt: new Date().toISOString(),
    };
    wishlistItems.push(item);
    return item;
  }

  async remove(userId: string, productId: string): Promise<boolean> {
    const idx = wishlistItems.findIndex(
      (w) => w.userId === userId && w.productId === productId
    );
    if (idx === -1) return false;
    wishlistItems.splice(idx, 1);
    return true;
  }

  async hasProduct(userId: string, productId: string): Promise<boolean> {
    return wishlistItems.some(
      (w) => w.userId === userId && w.productId === productId
    );
  }
}
