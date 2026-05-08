"use server";

import { auth } from "@/lib/auth/config";
import { orderRepo } from "@/lib/data";
import { checkoutSchema, shippingMethods } from "./schemas";
import type { CheckoutFormData } from "./schemas";
import type { CartItem } from "@/lib/store/cart";

interface PlaceOrderInput {
  formData: CheckoutFormData;
  cartItems: CartItem[];
}

interface PlaceOrderResult {
  orderId?: string;
  error?: string;
}

export async function placeOrderAction(
  input: PlaceOrderInput
): Promise<PlaceOrderResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const parsed = checkoutSchema.safeParse(input.formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const data = parsed.data;

  if (input.cartItems.length === 0) {
    return { error: "Cart is empty" };
  }

  const shippingMethod = shippingMethods.find(
    (m) => m.id === data.shippingMethodId
  );
  if (!shippingMethod) {
    return { error: "Invalid shipping method" };
  }

  const subtotal = input.cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = subtotal >= 1_000_000 ? 0 : shippingMethod.rate;
  const total = subtotal + shippingCost;

  const items = input.cartItems.map((item) => ({
    productId: item.productId,
    productName: item.name,
    productSlug: item.slug,
    image: item.image,
    sellerId: "stub-seller-id",
    unitPrice: item.price,
    quantity: item.quantity,
    lineTotal: item.price * item.quantity,
  }));

  const now = new Date().toISOString();

  const order = await orderRepo.create({
    userId: session.user.id,
    items,
    shippingAddress: {
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 ?? null,
      ward: data.ward,
      district: data.district,
      province: data.province,
      postalCode: "",
    },
    shippingMethod: {
      courier: shippingMethod.courier,
      rate: shippingCost,
      etaDays: shippingMethod.etaDays,
    },
    subtotal,
    shippingCost,
    total,
    currency: "VND",
    paymentMethod: data.paymentMethod,
    paymentRef: `STUB-${Date.now()}`,
    status: "paid",
    trackingNumber: null,
    trackingCourier: null,
    placedAt: now,
    paidAt: now,
    fulfilledAt: null,
    deliveredAt: null,
    escrowReleaseAt: null,
  });

  return { orderId: order.id };
}
