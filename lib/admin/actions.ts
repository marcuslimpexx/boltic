"use server";

import { auth } from "@/lib/auth/config";
import { revalidatePath } from "next/cache";
import { orderRepo } from "@/lib/data";
import type { Order, OrderStatus } from "@/lib/data/types";

export type AdminActionResult = { success: true } | { error: string };

async function requireAdmin(): Promise<{ id: string } | null> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return null;
  }
  return { id: session.user.id };
}

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus
): Promise<AdminActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };

  const order = await orderRepo.findById(orderId);
  if (!order) return { error: "Order not found" };

  const extra: Partial<Pick<Order,
    | "paidAt"
    | "fulfilledAt"
    | "deliveredAt"
    | "trackingNumber"
    | "trackingCourier"
    | "paymentRef"
    | "escrowReleaseAt"
  >> = {};

  if (status === "paid" && !order.paidAt) {
    extra.paidAt = new Date().toISOString();
  }
  if (status === "fulfilled" && !order.fulfilledAt) {
    extra.fulfilledAt = new Date().toISOString();
  }
  if (status === "delivered" && !order.deliveredAt) {
    extra.deliveredAt = new Date().toISOString();
  }
  if (status === "completed" && !order.escrowReleaseAt) {
    extra.escrowReleaseAt = new Date().toISOString();
  }

  const updated = await orderRepo.updateStatus(orderId, status, extra);
  if (!updated) return { error: "Failed to update order" };

  revalidatePath("/admin/orders");
  revalidatePath(`/orders/${orderId}`);
  return { success: true };
}

export async function updateProductStatusAction(
  productId: string,
  status: "active" | "draft" | "out_of_stock"
): Promise<AdminActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };

  // Mock repos don't support product status updates.
  // When Prisma is wired (Phase 7), productRepo.updateStatus will be called here.
  console.log(`[Admin] Product ${productId} status → ${status}`);
  revalidatePath("/admin/products");
  return { success: true };
}
