import type { ISellerRepository } from "../interfaces/seller.repository";
import type { Seller } from "@/lib/data/types";

const sellers: Seller[] = [
  {
    id: "seller-001",
    legalName: "Tech Distribution Vietnam Co., Ltd.",
    displayName: "TechVN Store",
    country: "VN",
    bankAccount: {
      accountName: "TECH DISTRIBUTION VIETNAM",
      accountNumber: "0123456789",
      bankCode: "VCB",
    },
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "seller-002",
    legalName: "Mobile Accessories SG Pte Ltd",
    displayName: "MobileAcc SG",
    country: "SG",
    bankAccount: {
      accountName: "MOBILE ACCESSORIES SG",
      accountNumber: "9876543210",
      bankCode: "DBS",
    },
    status: "active",
    createdAt: "2026-01-15T00:00:00Z",
  },
];

export class MockSellerRepository implements ISellerRepository {
  async findById(id: string): Promise<Seller | null> {
    return sellers.find((s) => s.id === id) ?? null;
  }

  async findByIds(ids: string[]): Promise<Seller[]> {
    return sellers.filter((s) => ids.includes(s.id));
  }
}
