import type { IPaymentProvider, PaymentRequest, PaymentResult } from "./provider";

export class StubPaymentProvider implements IPaymentProvider {
  async createPayment(req: PaymentRequest): Promise<PaymentResult> {
    return {
      paymentUrl: null,
      paymentRef: `STUB-${req.orderId.slice(-8).toUpperCase()}-${Date.now()}`,
      immediate: true,
    };
  }

  async verifyCallback(_params: Record<string, string>): Promise<{
    orderId: string;
    success: boolean;
    paymentRef: string;
  }> {
    // Stub never gets called via webhook — immediate payment
    return { orderId: "", success: false, paymentRef: "" };
  }
}
