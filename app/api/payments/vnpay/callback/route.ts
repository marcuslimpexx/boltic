import { NextRequest, NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { orderRepo, userRepo } from "@/lib/data";
import { sendOrderConfirmationEmail } from "@/lib/email";

/**
 * VNPay IPN (Instant Payment Notification) handler.
 * VNPay calls this URL (GET) after a payment attempt.
 * Must respond with { RspCode: "00", Message: "Confirm Success" } on success.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  try {
    const provider = getPaymentProvider();
    const result = await provider.verifyCallback(params);

    if (!result.success || !result.orderId) {
      return NextResponse.json({ RspCode: "97", Message: "Invalid signature" });
    }

    const order = await orderRepo.findById(result.orderId);
    if (!order) {
      return NextResponse.json({ RspCode: "01", Message: "Order not found" });
    }

    if (order.status !== "pending_payment") {
      // Already processed
      return NextResponse.json({ RspCode: "02", Message: "Order already updated" });
    }

    await orderRepo.updateStatus(order.id, "paid", {
      paidAt: new Date().toISOString(),
      paymentRef: result.paymentRef,
    });

    // Fire-and-forget confirmation email
    void (async () => {
      try {
        const user = await userRepo.findById(order.userId);
        if (user?.email) {
          await sendOrderConfirmationEmail(user.email, order.id, order.total, "vi");
        }
      } catch {
        // best-effort
      }
    })();

    return NextResponse.json({ RspCode: "00", Message: "Confirm Success" });
  } catch {
    return NextResponse.json({ RspCode: "99", Message: "Internal error" });
  }
}
