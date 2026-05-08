"use client";

import { useCartStore } from "@/lib/store/cart";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";
import { CartItemRow } from "./cart-item-row";
import { formatVND } from "@/lib/utils/format";

export function CartDrawer() {
  const t = useTranslations("cart");
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) closeDrawer(); }}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {t("title")}
            {items.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({items.length})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
            <p className="font-medium">{t("empty")}</p>
            <p className="text-sm text-muted-foreground">{t("empty_desc")}</p>
            <Button variant="outline" onClick={closeDrawer} asChild>
              <Link href="/products">{t("continue_shopping")}</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto -mx-6 px-6">
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <CartItemRow key={item.productId} item={item} />
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span className="font-bold">{formatVND(subtotal)}</span>
              </div>
              <Button className="w-full" asChild onClick={closeDrawer}>
                <Link href="/checkout">{t("checkout")}</Link>
              </Button>
              <Button variant="outline" className="w-full" onClick={closeDrawer}>
                {t("continue_shopping")}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
