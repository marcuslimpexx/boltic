import { Resend } from "resend";

// Graceful degradation: if no API key, fall back to console logging (dev/test mode)
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.EMAIL_FROM ?? "noreply@boltic.vn";

export interface SendResult {
  success: boolean;
  error?: string;
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
  locale: "vi" | "en"
): Promise<SendResult> {
  if (!resend) {
    console.log(`[Email stub] Password reset for ${to}`);
    console.log(`[Email stub] Reset URL: ${resetUrl}`);
    return { success: true };
  }

  const subject =
    locale === "vi"
      ? "Đặt lại mật khẩu Boltic"
      : "Reset your Boltic password";
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #0A0A0A;">${locale === "vi" ? "Đặt lại mật khẩu" : "Reset Your Password"}</h2>
      <p>${locale === "vi" ? "Nhấn vào liên kết bên dưới để đặt lại mật khẩu của bạn:" : "Click the link below to reset your password:"}</p>
      <p><a href="${resetUrl}" style="color: #6366F1; font-weight: bold;">${locale === "vi" ? "Đặt lại mật khẩu" : "Reset Password"}</a></p>
      <p style="color: #737373; font-size: 14px;">${locale === "vi" ? "Liên kết hết hạn sau 24 giờ. Nếu bạn không yêu cầu, hãy bỏ qua email này." : "This link expires in 24 hours. If you didn't request this, ignore this email."}</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="color: #737373; font-size: 12px;">Boltic — Power, Delivered.</p>
    </body>
    </html>
  `;

  const { error } = await resend.emails.send({ from: FROM, to, subject, html });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function sendOrderConfirmationEmail(
  to: string,
  orderId: string,
  total: number,
  locale: "vi" | "en"
): Promise<SendResult> {
  if (!resend) {
    console.log(`[Email stub] Order confirmation for ${to}, order ${orderId}`);
    return { success: true };
  }

  const orderRef = orderId.slice(-8).toUpperCase();
  const subject =
    locale === "vi"
      ? `Boltic — Xác nhận đơn hàng #${orderRef}`
      : `Boltic — Order Confirmation #${orderRef}`;

  const price = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(total);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://boltic.vn";
  const orderUrl = `${siteUrl}/${locale}/orders/${orderId}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #0A0A0A;">${locale === "vi" ? "Cảm ơn bạn đã đặt hàng!" : "Thanks for your order!"}</h2>
      <p>${locale === "vi" ? "Mã đơn hàng" : "Order ID"}: <strong>#${orderRef}</strong></p>
      <p>${locale === "vi" ? "Tổng cộng" : "Total"}: <strong style="color: #6366F1;">${price}</strong></p>
      <p><a href="${orderUrl}" style="color: #6366F1;">${locale === "vi" ? "Xem đơn hàng" : "View Order"}</a></p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="color: #737373; font-size: 12px;">Boltic — Power, Delivered.</p>
    </body>
    </html>
  `;

  const { error } = await resend.emails.send({ from: FROM, to, subject, html });
  if (error) return { success: false, error: error.message };
  return { success: true };
}
