import { randomUUID } from "crypto";
import type { IUserRepository } from "../interfaces/user.repository";
import type { User, Address } from "@/lib/data/types";

const users: User[] = [];
const addresses: Address[] = [];

export class MockUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    return users.find((u) => u.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  async create(data: {
    email: string;
    passwordHash: string;
    name: string;
  }): Promise<User> {
    const now = new Date().toISOString();
    const user: User = {
      id: randomUUID(),
      email: data.email,
      passwordHash: data.passwordHash,
      name: data.name,
      phone: null,
      emailVerifiedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    users.push(user);
    return user;
  }

  async update(
    id: string,
    data: Partial<Pick<User, "name" | "phone" | "emailVerifiedAt">>
  ): Promise<User | null> {
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    const existing = users[idx];
    if (!existing) return null;
    const updated: User = { ...existing, ...data, updatedAt: new Date().toISOString() };
    users[idx] = updated;
    return updated;
  }

  async updatePassword(id: string, passwordHash: string): Promise<boolean> {
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    const existing = users[idx];
    if (!existing) return false;
    users[idx] = { ...existing, passwordHash, updatedAt: new Date().toISOString() };
    return true;
  }

  async getAddresses(userId: string): Promise<Address[]> {
    return addresses.filter((a) => a.userId === userId);
  }

  async upsertAddress(
    addr: Omit<Address, "id"> & { id?: string }
  ): Promise<Address> {
    if (addr.id) {
      const idx = addresses.findIndex(
        (a) => a.id === addr.id && a.userId === addr.userId
      );
      if (idx !== -1) {
        const existing = addresses[idx];
        if (existing) {
          const updated: Address = { ...existing, ...addr } as Address;
          addresses[idx] = updated;
          return updated;
        }
      }
    }
    // Clear other defaults if this one is default
    if (addr.isDefault) {
      addresses
        .filter((a) => a.userId === addr.userId)
        .forEach((a) => {
          a.isDefault = false;
        });
    }
    const newAddr: Address = { ...addr, id: randomUUID() };
    addresses.push(newAddr);
    return newAddr;
  }

  async deleteAddress(id: string, userId: string): Promise<boolean> {
    const idx = addresses.findIndex(
      (a) => a.id === id && a.userId === userId
    );
    if (idx === -1) return false;
    addresses.splice(idx, 1);
    return true;
  }

  async setDefaultAddress(id: string, userId: string): Promise<boolean> {
    const userAddrs = addresses.filter((a) => a.userId === userId);
    const target = userAddrs.find((a) => a.id === id);
    if (!target) return false;
    userAddrs.forEach((a) => {
      a.isDefault = false;
    });
    target.isDefault = true;
    return true;
  }
}
