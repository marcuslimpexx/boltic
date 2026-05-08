// Active repository implementations.
// When DATABASE_URL is set, Prisma (PostgreSQL) repos are used.
// Otherwise, in-memory mock repos are used (no persistence across restarts).

import type { IProductRepository } from "./repositories/interfaces/product.repository";
import type { IUserRepository } from "./repositories/interfaces/user.repository";
import type { IOrderRepository, IReviewRepository, IWishlistRepository } from "./repositories/interfaces/order.repository";
import type { ISellerRepository } from "./repositories/interfaces/seller.repository";

function createRepositories() {
  if (process.env.DATABASE_URL) {
    const {
      PrismaProductRepository,
      PrismaUserRepository,
      PrismaOrderRepository,
      PrismaReviewRepository,
      PrismaWishlistRepository,
      PrismaSellerRepository,
    } = require("./repositories/prisma") as typeof import("./repositories/prisma");
    return {
      productRepo: new PrismaProductRepository() as IProductRepository,
      userRepo: new PrismaUserRepository() as IUserRepository,
      orderRepo: new PrismaOrderRepository() as IOrderRepository,
      reviewRepo: new PrismaReviewRepository() as IReviewRepository,
      wishlistRepo: new PrismaWishlistRepository() as IWishlistRepository,
      sellerRepo: new PrismaSellerRepository() as ISellerRepository,
    };
  }

  const { MockProductRepository } = require("./repositories/mock/product.mock") as typeof import("./repositories/mock/product.mock");
  const { MockUserRepository } = require("./repositories/mock/user.mock") as typeof import("./repositories/mock/user.mock");
  const {
    MockOrderRepository,
    MockReviewRepository,
    MockWishlistRepository,
  } = require("./repositories/mock/order.mock") as typeof import("./repositories/mock/order.mock");
  const { MockSellerRepository } = require("./repositories/mock/seller.mock") as typeof import("./repositories/mock/seller.mock");

  return {
    productRepo: new MockProductRepository() as IProductRepository,
    userRepo: new MockUserRepository() as IUserRepository,
    orderRepo: new MockOrderRepository() as IOrderRepository,
    reviewRepo: new MockReviewRepository() as IReviewRepository,
    wishlistRepo: new MockWishlistRepository() as IWishlistRepository,
    sellerRepo: new MockSellerRepository() as ISellerRepository,
  };
}

const repos = createRepositories();

export const productRepo = repos.productRepo;
export const userRepo = repos.userRepo;
export const orderRepo = repos.orderRepo;
export const reviewRepo = repos.reviewRepo;
export const wishlistRepo = repos.wishlistRepo;
export const sellerRepo = repos.sellerRepo;
