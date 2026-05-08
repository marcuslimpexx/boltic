import type { IPaymentProvider } from "./provider";
import { StubPaymentProvider } from "./stub.provider";
import { VNPayProvider } from "./vnpay.provider";

export type { IPaymentProvider, PaymentRequest, PaymentResult } from "./provider";

let _provider: IPaymentProvider | null = null;

export function getPaymentProvider(): IPaymentProvider {
  if (_provider) return _provider;
  const providerName = process.env.PAYMENT_PROVIDER ?? "stub";
  if (providerName === "vnpay") {
    _provider = new VNPayProvider();
  } else {
    _provider = new StubPaymentProvider();
  }
  return _provider;
}
