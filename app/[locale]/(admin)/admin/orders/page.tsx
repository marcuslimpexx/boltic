import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { orderRepo } from "@/lib/data";
import { formatVND } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import type { Order, OrderStatus } from "@/lib/data/types";
import { OrderStatusSelect } from "./order-status-select";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}

export const metadata: Metadata = { title: "Orders — Admin" };

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending_payment: "bg-yellow-100 text-yellow-700 border-yellow-200",
  paid: "bg-blue-100 text-blue-700 border-blue-200",
  fulfilled: "bg-indigo-100 text-indigo-700 border-indigo-200",
  in_transit: "bg-purple-100 text-purple-700 border-purple-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
  completed: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
  payment_failed: "bg-red-100 text-red-700 border-red-200",
  refund_requested: "bg-orange-100 text-orange-700 border-orange-200",
  refunded: "bg-gray-100 text-gray-700 border-gray-200",
};

const FILTER_STATUSES: OrderStatus[] = [
  "pending_payment",
  "paid",
  "fulfilled",
  "in_transit",
  "delivered",
  "completed",
  "cancelled",
];

export default async function AdminOrdersPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { status } = await searchParams;
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect(`/${locale}/login`);
  }

  const validStatus = status as OrderStatus | undefined;
  const orders = await orderRepo.findAllForAdmin(validStatus);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {orders.length} order{orders.length !== 1 ? "s" : ""}{" "}
          {status ? `with status: ${status.replace(/_/g, " ")}` : "total"}
        </p>
      </div>

      {/* Status filter */}
      <div className="bg-background rounded-lg border border-border p-4 mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            !status
              ? "bg-primary text-white border-primary"
              : "border-border hover:border-primary/40"
          }`}
        >
          All
        </Link>
        {FILTER_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              status === s
                ? "bg-primary text-white border-primary"
                : "border-border hover:border-primary/40"
            }`}
          >
            {s.replace(/_/g, " ")}
          </Link>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-background rounded-lg border border-border overflow-hidden">
        {orders.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Order
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                  Customer
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                  Total
                </th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                  Update Status
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: Order) => (
                <tr
                  key={order.id}
                  className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-mono text-xs font-medium">
                        #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div>
                      <p className="text-sm">{order.shippingAddress.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.shippingAddress.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatVND(order.total)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border font-medium ${STATUS_COLORS[order.status]}`}
                    >
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                    {new Date(order.placedAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="ghost" size="sm" className="text-xs">
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No orders yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Orders will appear here after customers check out
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
