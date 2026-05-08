import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth/config";
import { orderRepo } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatVND } from "@/lib/utils/format";
import type { Metadata } from "next";
import type { OrderStatus } from "@/lib/data/types";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "orders" });
  return { title: t("title") };
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending_payment: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  fulfilled: "bg-blue-100 text-blue-800",
  in_transit: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  payment_failed: "bg-red-100 text-red-800",
  refund_requested: "bg-orange-100 text-orange-800",
  refunded: "bg-gray-100 text-gray-800",
};

export default async function OrderHistoryPage({ params }: PageProps) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const [orders, t] = await Promise.all([
    orderRepo.findByUserId(session.user.id),
    getTranslations({ locale, namespace: "orders" }),
  ]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <p className="text-muted-foreground">{t("no_orders")}</p>
          <Button asChild>
            <Link href="/products">{t("shop_now")}</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusKey =
              `status_${order.status}` as Parameters<typeof t>[0];
            const displayId = order.id.slice(-8).toUpperCase();
            return (
              <div
                key={order.id}
                className="border border-border rounded-xl overflow-hidden"
              >
                {/* Order header */}
                <div className="flex items-center justify-between p-4 bg-secondary/50">
                  <div>
                    <p className="text-sm font-semibold">
                      {t("order_number", { id: displayId })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("placed_at", {
                        date: new Date(order.placedAt).toLocaleDateString(
                          locale === "vi" ? "vi-VN" : "en-US"
                        ),
                      })}
                    </p>
                  </div>
                  <Badge className={STATUS_COLORS[order.status]}>
                    {t(statusKey)}
                  </Badge>
                </div>

                {/* Items preview */}
                <div className="p-4 space-y-1.5">
                  {order.items.slice(0, 3).map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm"
                    >
                      <span className="line-clamp-1 flex-1 pr-4 text-muted-foreground">
                        {item.productName} ×{item.quantity}
                      </span>
                      <span className="font-medium shrink-0">
                        {formatVND(item.lineTotal)}
                      </span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{order.items.length - 3} more item(s)
                    </p>
                  )}
                </div>

                <Separator />

                {/* Footer */}
                <div className="flex items-center justify-between p-4">
                  <p className="font-bold">{formatVND(order.total)}</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/orders/${order.id}`}>{t("view_order")}</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
