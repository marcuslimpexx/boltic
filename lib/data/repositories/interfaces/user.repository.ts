import type { User, Address } from "@/lib/data/types";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: { email: string; passwordHash: string; name: string }): Promise<User>;
  update(
    id: string,
    data: Partial<Pick<User, "name" | "phone" | "emailVerifiedAt">>
  ): Promise<User | null>;
  updatePassword(id: string, passwordHash: string): Promise<boolean>;
  getAddresses(userId: string): Promise<Address[]>;
  upsertAddress(address: Omit<Address, "id"> & { id?: string }): Promise<Address>;
  deleteAddress(id: string, userId: string): Promise<boolean>;
  setDefaultAddress(id: string, userId: string): Promise<boolean>;
}
