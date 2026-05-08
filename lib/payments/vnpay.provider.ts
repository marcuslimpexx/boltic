import { createHmac } from "crypto";
import type { IPaymentProvider, PaymentRequest, PaymentResult } from "./provider";

const VNPAY_URL = process.env.VNPAY_URL ?? "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const TMN_CODE = process.env.VNPAY_TMN_CODE ?? "";
const HASH_SECRET = process.env.VNPAY_HASH_SECRET ?? "";

function formatVNPayDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    String(date.getFullYear()) +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

function sortObject(obj: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(obj).sort(([a], [b]) => a.localeCompare(b))
  );
}

function buildQueryString(obj: Record<string, string>): string {
  return Object.entries(obj)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

export class VNPayProvider implements IPaymentProvider {
  async createPayment(req: PaymentRequest): Promise<PaymentResult> {
    const createDate = formatVNPayDate(new Date());

    const params: Record<string, string> = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: TMN_CODE,
      vnp_Amount: String(req.amount * 100), // VNPay expects amount × 100
      vnp_CurrCode: "VND",
      vnp_TxnRef: req.orderId,
      vnp_OrderInfo: req.orderInfo.slice(0, 255),
      vnp_OrderType: "billpayment",
      vnp_Locale: req.locale === "en" ? "en" : "vn",
      vnp_ReturnUrl: req.returnUrl,
      vnp_IpAddr: req.ipAddr,
      vnp_CreateDate: createDate,
    };

    const sorted = sortObject(params);
    const signData = buildQueryString(sorted);
    const hmac = createHmac("sha512", HASH_SECRET);
    const secureHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    const paymentUrl =
      VNPAY_URL + "?" + signData + "&vnp_SecureHash=" + secureHash;

    return { paymentUrl, paymentRef: null, immediate: false };
  }

  async verifyCallback(params: Record<string, string>): Promise<{
    orderId: string;
    success: boolean;
    paymentRef: string;
  }> {
    const secureHash = params["vnp_SecureHash"] ?? "";
    const { vnp_SecureHash: _hash, vnp_SecureHashType: _type, ...rest } = params;
    void _hash;
    void _type;

    const sorted = sortObject(rest as Record<string, string>);
    const signData = buildQueryString(sorted);
    const hmac = createHmac("sha512", HASH_SECRET);
    const expectedHash = hmac
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    if (secureHash !== expectedHash) {
      return { orderId: "", success: false, paymentRef: "" };
    }

    const orderId = params["vnp_TxnRef"] ?? "";
    const responseCode = params["vnp_ResponseCode"] ?? "";
    const paymentRef = params["vnp_TransactionNo"] ?? "";

    return {
      orderId,
      success: responseCode === "00",
      paymentRef,
    };
  }
}
