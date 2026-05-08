import type { IUserRepository } from "../interfaces/user.repository";
import type { User, Address } from "@/lib/data/types";

export class MockUserRepository implements IUserRepository {
  async findById(_id: string): Promise<User | null> { return null; }
  async findByEmail(_email: string): Promise<User | null> { return null; }
  async create(_data: { email: string; passwordHash: string; name: string }): Promise<User> {
    throw new Error("Not implemented");
  }
  async update(_id: string, _data: Partial<Pick<User, "name" | "phone" | "emailVerifiedAt">>): Promise<User | null> { return null; }
  async updatePassword(_id: string, _passwordHash: string): Promise<boolean> { return false; }
  async getAddresses(_userId: string): Promise<Address[]> { return []; }
  async upsertAddress(_address: Omit<Address, "id"> & { id?: string }): Promise<Address> {
    throw new Error("Not implemented");
  }
  async deleteAddress(_id: string, _userId: string): Promise<boolean> { return false; }
  async setDefaultAddress(_id: string, _userId: string): Promise<boolean> { return false; }
}
