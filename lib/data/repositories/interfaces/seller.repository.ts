import type { Seller } from "@/lib/data/types";

export interface ISellerRepository {
  findById(id: string): Promise<Seller | null>;
  findByIds(ids: string[]): Promise<Seller[]>;
}
