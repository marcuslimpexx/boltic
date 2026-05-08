import type { IOrderRepository } from "../interfaces/order.repository";
import type { Order, OrderStatus } from "@/lib/data/types";
import { prisma } from "@/lib/prisma";

type PrismaOrder = {
  id: string;
  userId: string;
  items: unknown;
  shippingAddress: unknown;
  shippingMethod: unknown;
  subtotal: number;
  shippingCost: number;
  total: number;
  currency: string;
  paymentMethod: string;
  paymentRef: string | null;
  status: string;
  trackingNumber: string | null;
  trackingCourier: string | null;
  placedAt: Date;
  paidAt: Date | null;
  fulfilledAt: Date | null;
  deliveredAt: Date | null;
  escrowReleaseAt: Date | null;
};

function toOrder(p: PrismaOrder): Order {
  return {
    id: p.id,
    userId: p.userId,
    items: p.items as Order["items"],
    shippingAddress: p.shippingAddress as Order["shippingAddress"],
    shippingMethod: p.shippingMethod as Order["shippingMethod"],
    subtotal: p.subtotal,
    shippingCost: p.shippingCost,
    total: p.total,
    currency: "VND",
    paymentMethod: p.paymentMethod as Order["paymentMethod"],
    paymentRef: p.paymentRef,
    status: p.status as OrderStatus,
    trackingNumber: p.trackingNumber,
    trackingCourier: p.trackingCourier,
    placedAt: p.placedAt.toISOString(),
    paidAt: p.paidAt?.toISOString() ?? null,
    fulfilledAt: p.fulfilledAt?.toISOString() ?? null,
    deliveredAt: p.deliveredAt?.toISOString() ?? null,
    escrowReleaseAt: p.escrowReleaseAt?.toISOString() ?? null,
  };
}

export class PrismaOrderRepository implements IOrderRepository {
  async findById(id: string): Promise<Order | null> {
    const o = await prisma.order.findUnique({ where: { id } });
    return o ? toOrder(o) : null;
  }

  async findByUserId(userId: string, status?: OrderStatus): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      orderBy: { placedAt: "desc" },
    });
    return orders.map(toOrder);
  }

  async create(order: Omit<Order, "id">): Promise<Order> {
    const created = await prisma.order.create({
      data: {
        userId: order.userId,
        items: order.items as unknown as Parameters<typeof prisma.order.create>[0]["data"]["items"],
        shippingAddress: order.shippingAddress as unknown as Parameters<typeof prisma.order.create>[0]["data"]["shippingAddress"],
        shippingMethod: order.shippingMethod as unknown as Parameters<typeof prisma.order.create>[0]["data"]["shippingMethod"],
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        total: order.total,
        currency: order.currency,
        paymentMethod: order.paymentMethod,
        ...(order.paymentRef !== null ? { paymentRef: order.paymentRef } : {}),
        status: order.status,
        ...(order.trackingNumber !== null ? { trackingNumber: order.trackingNumber } : {}),
        ...(order.trackingCourier !== null ? { trackingCourier: order.trackingCourier } : {}),
        placedAt: new Date(order.placedAt),
        ...(order.paidAt !== null ? { paidAt: new Date(order.paidAt) } : {}),
        ...(order.fulfilledAt !== null ? { fulfilledAt: new Date(order.fulfilledAt) } : {}),
        ...(order.deliveredAt !== null ? { deliveredAt: new Date(order.deliveredAt) } : {}),
        ...(order.escrowReleaseAt !== null ? { escrowReleaseAt: new Date(order.escrowReleaseAt) } : {}),
      },
    });
    return toOrder(created);
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    extra?: Partial<
      Pick<
        Order,
        | "paidAt"
        | "fulfilledAt"
        | "deliveredAt"
        | "trackingNumber"
        | "trackingCourier"
        | "paymentRef"
        | "escrowReleaseAt"
      >
    >
  ): Promise<Order | null> {
    try {
      const data: {
        status: string;
        paidAt?: Date;
        fulfilledAt?: Date;
        deliveredAt?: Date;
        escrowReleaseAt?: Date;
        trackingNumber?: string;
        trackingCourier?: string;
        paymentRef?: string;
      } = { status };
      if (extra?.paidAt) data.paidAt = new Date(extra.paidAt);
      if (extra?.fulfilledAt) data.fulfilledAt = new Date(extra.fulfilledAt);
      if (extra?.deliveredAt) data.deliveredAt = new Date(extra.deliveredAt);
      if (extra?.escrowReleaseAt) data.escrowReleaseAt = new Date(extra.escrowReleaseAt);
      if (extra?.trackingNumber) data.trackingNumber = extra.trackingNumber;
      if (extra?.trackingCourier) data.trackingCourier = extra.trackingCourier;
      if (extra?.paymentRef) data.paymentRef = extra.paymentRef;
      const updated = await prisma.order.update({ where: { id }, data });
      return toOrder(updated);
    } catch {
      return null;
    }
  }

  async findAllForAdmin(status?: OrderStatus): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: status ? { status } : {},
      orderBy: { placedAt: "desc" },
      take: 200,
    });
    return orders.map(toOrder);
  }
}
