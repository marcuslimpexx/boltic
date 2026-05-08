// Type-only import — zero runtime cost; does not cause bundling.
import type { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  // Use require() so Turbopack treats these as external (serverExternalPackages).
  // Static ESM imports would cause Turbopack to bundle @prisma/client and
  // @prisma/adapter-pg into the chunk, which breaks native pg bindings.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient: PC } = require("@prisma/client") as typeof import("@prisma/client");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaPg } = require("@prisma/adapter-pg") as typeof import("@prisma/adapter-pg");
  const adapter = new PrismaPg(process.env.DATABASE_URL ?? "");
  return new PC({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// Lazily instantiate PrismaClient on first property access.
// This prevents any Prisma code from running during module evaluation
// when DATABASE_URL is absent (e.g. during Next.js build / CI).
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? (value as Function).bind(client) : value;
  },
});
