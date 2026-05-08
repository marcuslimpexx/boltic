// ─── Port Types ───────────────────────────────────────────────────────────────
export type PortType = "USB-A" | "USB-C" | "Lightning" | "Micro-USB";

// ─── Product ──────────────────────────────────────────────────────────────────
export interface ProductAttributes {
  capacityMah: number;
  outputWatts: number;
  inputPorts: PortType[];
  outputPorts: PortType[];
  fastCharging: boolean;
  wirelessCharging: boolean;
  passthrough: boolean;
  weightGrams: number;
  dimensionsMm: { l: number; w: number; h: number };
  color: string;
  certifications: string[];
}

export type ProductStatus = "active" | "draft" | "out_of_stock";

export interface Product {
  id: string;
  slug: string;
  name: { en: string; vi: string };
  description: { en: string; vi: string };
  brand: string;
  sellerId: string;
  price: number;
  compareAtPrice: number | null;
  currency: "VND";
  images: string[];
  attributes: ProductAttributes;
  stock: number;
  status: ProductStatus;
  ratingAvg: number;
  ratingCount: number;
  salesCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Seller ───────────────────────────────────────────────────────────────────
export type SellerCountry = "VN" | "SG" | "TH" | "ID" | "MY" | "PH" | string;
export type SellerStatus = "active" | "suspended";

export interface Seller {
  id: string;
  legalName: string;
  displayName: string;
  country: SellerCountry;
  bankAccount: {
    accountName: string;
    accountNumber: string;
    bankCode: string;
  };
  status: SellerStatus;
  createdAt: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  phone: string | null;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PublicUser = Omit<User, "passwordHash">;

// ─── Address ──────────────────────────────────────────────────────────────────
export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string | null;
  ward: string;
  district: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

// ─── Order ────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "fulfilled"
  | "in_transit"
  | "delivered"
  | "completed"
  | "cancelled"
  | "payment_failed"
  | "refund_requested"
  | "refunded";

export type PaymentMethod = "bank_transfer" | "vietqr" | "momo" | "zalopay";

export interface OrderItem {
  productId: string;
  productName: string;
  productSlug: string;
  image: string;
  sellerId: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Omit<Address, "id" | "userId" | "isDefault">;
  shippingMethod: { courier: string; rate: number; etaDays: number };
  subtotal: number;
  shippingCost: number;
  total: number;
  currency: "VND";
  paymentMethod: PaymentMethod;
  paymentRef: string | null;
  status: OrderStatus;
  trackingNumber: string | null;
  trackingCourier: string | null;
  placedAt: string;
  paidAt: string | null;
  fulfilledAt: string | null;
  deliveredAt: string | null;
  escrowReleaseAt: string | null;
}

// ─── Review ───────────────────────────────────────────────────────────────────
export type ReviewStatus = "published" | "flagged" | "removed";

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string | null;
  photos: string[];
  verifiedPurchase: boolean;
  helpfulCount: number;
  reportedCount: number;
  status: ReviewStatus;
  createdAt: string;
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  addedAt: string;
}

// ─── Filters / Pagination ─────────────────────────────────────────────────────
export interface ProductFilters {
  search?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  minCapacityMah?: number;
  maxCapacityMah?: number;
  fastCharging?: boolean;
  wirelessCharging?: boolean;
  outputPorts?: PortType[];
  minRating?: number;
  status?: ProductStatus;
  page?: number;
  pageSize?: number;
  sort?: "relevance" | "newest" | "price_asc" | "price_desc" | "rating" | "best_selling";
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
