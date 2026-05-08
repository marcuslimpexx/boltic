import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import productsData from "../lib/data/seed/products.json";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create stub seller
  const seller = await prisma.seller.upsert({
    where: { id: "stub-seller-id" },
    update: {},
    create: {
      id: "stub-seller-id",
      legalName: "PEXX Technology PTE Ltd",
      displayName: "Boltic Official",
      country: "SG",
      bankAccount: {
        accountName: "PEXX Technology",
        accountNumber: "000000000",
        bankCode: "DBS",
      },
      status: "active",
    },
  });
  console.log(`✅ Seller: ${seller.displayName}`);

  // Seed products
  let count = 0;
  for (const product of productsData) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        id: product.id,
        slug: product.slug,
        nameEn: product.name.en,
        nameVi: product.name.vi,
        descriptionEn: product.description.en,
        descriptionVi: product.description.vi,
        brand: product.brand,
        sellerId: "stub-seller-id",
        price: product.price,
        compareAtPrice: product.compareAtPrice ?? null,
        currency: "VND",
        images: product.images,
        attributes: product.attributes,
        stock: product.stock,
        status: product.status,
        ratingAvg: product.ratingAvg,
        ratingCount: product.ratingCount,
        salesCount: product.salesCount,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt),
      },
    });
    count++;
  }
  console.log(`✅ Products seeded: ${count}`);
  console.log("✨ Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
