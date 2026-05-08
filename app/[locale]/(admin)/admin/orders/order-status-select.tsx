"use client";

import { useTransition } from "react";
import { updateOrderStatusAction } from "@/lib/admin/actions";
import type { OrderStatus } from "@/lib/data/types";
import { toast } from "sonner";

interface Props {
  orderId: string;
  currentStatus: OrderStatus;
}

const ALL_STATUSES: OrderStatus[] = [
  "pending_payment",
  "paid",
  "fulfilled",
  "in_transit",
  "delivered",
  "completed",
  "cancelled",
  "payment_failed",
  "refund_requested",
  "refunded",
];

export function OrderStatusSelect({ orderId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as OrderStatus;
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, newStatus);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Order status updated");
      }
    });
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className="text-xs border border-border rounded px-2 py-1 bg-background disabled:opacity-50 cursor-pointer"
    >
      {ALL_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}
