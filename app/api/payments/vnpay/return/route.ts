import { NextRequest, NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";

/**
 * VNPay return URL handler.
 * After payment, VNPay redirects the user to this URL.
 * We verify the signature and redirect to the order confirmation page.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const provider = getPaymentProvider();
    const result = await provider.verifyCallback(params);
    const orderId = result.orderId || (params["vnp_TxnRef"] ?? "");

    if (result.success && orderId) {
      return NextResponse.redirect(`${siteUrl}/vi/orders/${orderId}`);
    }

    // Payment failed — redirect to checkout with error
    return NextResponse.redirect(`${siteUrl}/vi/checkout?payment_error=1`);
  } catch {
    return NextResponse.redirect(`${siteUrl}/vi/checkout?payment_error=1`);
  }
}
