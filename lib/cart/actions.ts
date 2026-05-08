"use server";

import { auth } from "@/lib/auth/config";
import { orderRepo, userRepo } from "@/lib/data";
import { checkoutSchema, shippingMethods } from "./schemas";
import type { CheckoutFormData } from "./schemas";
import type { CartItem } from "@/lib/store/cart";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { getPaymentProvider } from "@/lib/payments";

interface PlaceOrderInput {
  formData: CheckoutFormData;
  cartItems: CartItem[];
  locale?: string;
  ipAddr?: string;
}

interface PlaceOrderResult {
  orderId?: string;
  paymentUrl?: string;
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
    paymentRef: null,
    status: "pending_payment",
    trackingNumber: null,
    trackingCourier: null,
    placedAt: now,
    paidAt: null,
    fulfilledAt: null,
    deliveredAt: null,
    escrowReleaseAt: null,
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const paymentProvider = getPaymentProvider();
  const paymentResult = await paymentProvider.createPayment({
    orderId: order.id,
    amount: order.total,
    orderInfo: `Boltic order #${order.id.slice(-8).toUpperCase()}`,
    returnUrl: `${siteUrl}/api/payments/vnpay/return`,
    ipAddr: input.ipAddr ?? "127.0.0.1",
    locale: (input.locale === "en" ? "en" : "vi") as "vi" | "en",
  });

  if (paymentResult.immediate) {
    await orderRepo.updateStatus(order.id, "paid", {
      paidAt: new Date().toISOString(),
      paymentRef: paymentResult.paymentRef,
    });

    // Fire-and-forget order confirmation email (non-blocking)
    void (async () => {
      try {
        const user = await userRepo.findById(session.user.id);
        if (user?.email) {
          const emailLocale = (input.locale === "en" ? "en" : "vi") as "vi" | "en";
          await sendOrderConfirmationEmail(user.email, order.id, order.total, emailLocale);
        }
      } catch {
        // Email sending is best-effort; don't fail the order
      }
    })();

    return { orderId: order.id };
  }

  if (paymentResult.paymentUrl) {
    return { orderId: order.id, paymentUrl: paymentResult.paymentUrl };
  }
  return { orderId: order.id };
}
