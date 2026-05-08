import type { ISellerRepository } from "../interfaces/seller.repository";
import type { Seller } from "@/lib/data/types";
import { prisma } from "@/lib/prisma";

function toSeller(p: {
  id: string;
  legalName: string;
  displayName: string;
  country: string;
  bankAccount: unknown;
  status: string;
  createdAt: Date;
}): Seller {
  return {
    id: p.id,
    legalName: p.legalName,
    displayName: p.displayName,
    country: p.country,
    bankAccount: p.bankAccount as Seller["bankAccount"],
    status: p.status as Seller["status"],
    createdAt: p.createdAt.toISOString(),
  };
}

export class PrismaSellerRepository implements ISellerRepository {
  async findById(id: string): Promise<Seller | null> {
    const seller = await prisma.seller.findUnique({ where: { id } });
    return seller ? toSeller(seller) : null;
  }

  async findByIds(ids: string[]): Promise<Seller[]> {
    const sellers = await prisma.seller.findMany({
      where: { id: { in: ids } },
    });
    return sellers.map(toSeller);
  }
}
