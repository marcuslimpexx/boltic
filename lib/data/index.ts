// Active repository implementations — swap these imports to change the data layer
import { MockProductRepository } from "./repositories/mock/product.mock";
import { MockUserRepository } from "./repositories/mock/user.mock";
import {
  MockOrderRepository,
  MockReviewRepository,
  MockWishlistRepository,
} from "./repositories/mock/order.mock";

export const productRepo = new MockProductRepository();
export const userRepo = new MockUserRepository();
export const orderRepo = new MockOrderRepository();
export const reviewRepo = new MockReviewRepository();
export const wishlistRepo = new MockWishlistRepository();
