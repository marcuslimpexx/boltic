import type { IUserRepository } from "../interfaces/user.repository";
import type { User, Address } from "@/lib/data/types";
import { prisma } from "@/lib/prisma";

function toUser(p: {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  phone: string | null;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): User {
  return {
    id: p.id,
    email: p.email,
    passwordHash: p.passwordHash,
    name: p.name,
    role: p.role as "user" | "admin",
    phone: p.phone,
    emailVerifiedAt: p.emailVerifiedAt?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

function toAddress(p: {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string | null;
  ward: string;
  district: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}): Address {
  return {
    id: p.id,
    userId: p.userId,
    fullName: p.fullName,
    phone: p.phone,
    email: p.email,
    addressLine1: p.addressLine1,
    addressLine2: p.addressLine2,
    ward: p.ward,
    district: p.district,
    province: p.province,
    postalCode: p.postalCode,
    isDefault: p.isDefault,
  };
}

export class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? toUser(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    return user ? toUser(user) : null;
  }

  async create(data: {
    email: string;
    passwordHash: string;
    name: string;
  }): Promise<User> {
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        name: data.name,
      },
    });
    return toUser(user);
  }

  async update(
    id: string,
    data: Partial<Pick<User, "name" | "phone" | "emailVerifiedAt">>
  ): Promise<User | null> {
    try {
      const updateData: {
        name?: string;
        phone?: string | null;
        emailVerifiedAt?: Date | null;
      } = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.emailVerifiedAt !== undefined) {
        updateData.emailVerifiedAt = data.emailVerifiedAt
          ? new Date(data.emailVerifiedAt)
          : null;
      }
      const user = await prisma.user.update({ where: { id }, data: updateData });
      return toUser(user);
    } catch {
      return null;
    }
  }

  async updatePassword(id: string, passwordHash: string): Promise<boolean> {
    try {
      await prisma.user.update({ where: { id }, data: { passwordHash } });
      return true;
    } catch {
      return false;
    }
  }

  async getAddresses(userId: string): Promise<Address[]> {
    const addresses = await prisma.address.findMany({ where: { userId } });
    return addresses.map(toAddress);
  }

  async upsertAddress(
    addr: Omit<Address, "id"> & { id?: string }
  ): Promise<Address> {
    if (addr.id) {
      const updated = await prisma.address.update({
        where: { id: addr.id },
        data: {
          fullName: addr.fullName,
          phone: addr.phone,
          email: addr.email,
          addressLine1: addr.addressLine1,
          addressLine2: addr.addressLine2 ?? null,
          ward: addr.ward,
          district: addr.district,
          province: addr.province,
          postalCode: addr.postalCode,
          isDefault: addr.isDefault,
        },
      });
      return toAddress(updated);
    }
    if (addr.isDefault) {
      await prisma.address.updateMany({
        where: { userId: addr.userId },
        data: { isDefault: false },
      });
    }
    const created = await prisma.address.create({
      data: {
        userId: addr.userId,
        fullName: addr.fullName,
        phone: addr.phone,
        email: addr.email,
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2 ?? null,
        ward: addr.ward,
        district: addr.district,
        province: addr.province,
        postalCode: addr.postalCode,
        isDefault: addr.isDefault,
      },
    });
    return toAddress(created);
  }

  async deleteAddress(id: string, userId: string): Promise<boolean> {
    try {
      await prisma.address.deleteMany({ where: { id, userId } });
      return true;
    } catch {
      return false;
    }
  }

  async setDefaultAddress(id: string, userId: string): Promise<boolean> {
    try {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
      await prisma.address.update({ where: { id }, data: { isDefault: true } });
      return true;
    } catch {
      return false;
    }
  }
}
