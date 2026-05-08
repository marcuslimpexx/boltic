import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth/config";
import { orderRepo } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { formatVND } from "@/lib/utils/format";
import type { Metadata } from "next";
import type { OrderStatus } from "@/lib/data/types";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "orders" });
  return { title: t("confirmation_title") };
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending_payment: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  fulfilled: "bg-blue-100 text-blue-800",
  in_transit: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  payment_failed: "bg-red-100 text-red-800",
  refund_requested: "bg-orange-100 text-orange-800",
  refunded: "bg-gray-100 text-gray-800",
};

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { locale, id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const [order, t] = await Promise.all([
    orderRepo.findById(id),
    getTranslations({ locale, namespace: "orders" }),
  ]);

  if (!order || order.userId !== session.user.id) notFound();

  const shortId = order.id.slice(-8).toUpperCase();

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      {/* Success banner */}
      <div className="text-center mb-10 space-y-3">
        <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold">{t("confirmation_title")}</h1>
        <p className="text-muted-foreground">{t("confirmation_subtitle")}</p>
        <p className="text-sm font-mono bg-secondary px-4 py-2 rounded-lg inline-block">
          {t("order_number", { id: shortId })}
        </p>
      </div>

      {/* Order details */}
      <div className="border border-border rounded-xl divide-y divide-border">
        {/* Items */}
        <div className="p-4 space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            {t("items")}
          </h2>
          {order.items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="line-clamp-1 flex-1 pr-4">
                {item.productName}{" "}
                <span className="text-muted-foreground">×{item.quantity}</span>
              </span>
              <span className="font-medium shrink-0">
                {formatVND(item.lineTotal)}
              </span>
            </div>
          ))}
        </div>

        {/* Shipping address */}
        <div className="p-4">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
            {t("shipping_to")}
          </h2>
          <p className="text-sm">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-muted-foreground">
            {order.shippingAddress.addressLine1},{" "}
            {order.shippingAddress.ward},{" "}
            {order.shippingAddress.district},{" "}
            {order.shippingAddress.province}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.shippingAddress.phone}
          </p>
        </div>

        {/* Totals */}
        <div className="p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatVND(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Shipping ({order.shippingMethod.courier})
            </span>
            <span>
              {order.shippingCost === 0 ? "Free" : formatVND(order.shippingCost)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span>{formatVND(order.total)}</span>
          </div>
        </div>

        {/* Status */}
        <div className="p-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t("payment")}</span>
          <Badge className={STATUS_COLORS[order.status]}>
            {t(`status_${order.status}` as Parameters<typeof t>[0])}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-3 justify-center">
        <Button asChild>
          <Link href="/products">{t("continue_shopping")}</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/account/orders">{t("title")}</Link>
        </Button>
      </div>
    </div>
  );
}
