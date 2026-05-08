export interface PaymentRequest {
  orderId: string;
  amount: number; // VND, integer
  orderInfo: string;
  returnUrl: string;
  ipAddr: string;
  locale: "vi" | "en";
}

export interface PaymentResult {
  /** If present, redirect the user to this URL to complete payment */
  paymentUrl: string | null;
  /** Reference for the transaction if payment is immediate (stub) */
  paymentRef: string | null;
  /** True if payment was completed immediately (stub mode) */
  immediate: boolean;
}

export interface IPaymentProvider {
  createPayment(req: PaymentRequest): Promise<PaymentResult>;
  verifyCallback(params: Record<string, string>): Promise<{
    orderId: string;
    success: boolean;
    paymentRef: string;
  }>;
}
