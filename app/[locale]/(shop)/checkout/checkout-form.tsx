"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCartStore } from "@/lib/store/cart";
import { checkoutSchema, shippingMethods } from "@/lib/cart/schemas";
import { placeOrderAction } from "@/lib/cart/actions";
import type { CheckoutFormData } from "@/lib/cart/schemas";
import { formatVND } from "@/lib/utils/format";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface CheckoutFormProps {
  locale: string;
}

export function CheckoutForm({ locale: _locale }: CheckoutFormProps) {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clearCart);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      ward: "",
      district: "",
      province: "",
      shippingMethodId: "ghn",
      paymentMethod: "vietqr",
    },
  });

  const selectedShippingId = form.watch("shippingMethodId");
  const selectedShipping =
    shippingMethods.find((m) => m.id === selectedShippingId) ??
    shippingMethods[0]!;
  const shippingCost = subtotal >= 1_000_000 ? 0 : selectedShipping.rate;
  const total = subtotal + shippingCost;

  const onSubmit = async (data: CheckoutFormData) => {
    setServerError(null);
    const result = await placeOrderAction({ formData: data, cartItems: items });
    if (result.error) {
      setServerError(result.error);
      return;
    }
    clearCart();
    router.push(`/orders/${result.orderId}`);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-muted-foreground">{tCart("empty")}</p>
        <Button asChild>
          <Link href="/products">{tCart("continue_shopping")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">{t("title")}</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            {/* Left: form fields */}
            <div className="space-y-8">
              {/* Contact */}
              <section className="space-y-4">
                <h2 className="font-semibold text-lg">{t("contact")}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("full_name")}</FormLabel>
                        <FormControl>
                          <Input {...field} autoComplete="name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("phone")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            autoComplete="tel"
                            placeholder="0901234567"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" autoComplete="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <Separator />

              {/* Address */}
              <section className="space-y-4">
                <h2 className="font-semibold text-lg">{t("address")}</h2>
                <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("address_line1")}</FormLabel>
                      <FormControl>
                        <Input {...field} autoComplete="address-line1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("address_line2")}</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          autoComplete="address-line2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="ward"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("ward")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("district")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("province")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <Separator />

              {/* Shipping */}
              <section className="space-y-4">
                <h2 className="font-semibold text-lg">{t("shipping_method")}</h2>
                <p className="text-xs text-muted-foreground">
                  {t("free_shipping_notice")}
                </p>
                <FormField
                  control={form.control}
                  name="shippingMethodId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={(val) => field.onChange(val)}
                          className="space-y-2"
                        >
                          {shippingMethods.map((method) => {
                            const cost =
                              subtotal >= 1_000_000 ? 0 : method.rate;
                            return (
                              <div
                                key={method.id}
                                className="flex items-center justify-between border border-border rounded-lg p-3 cursor-pointer hover:border-primary/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <RadioGroupItem
                                    value={method.id}
                                    id={method.id}
                                  />
                                  <Label
                                    htmlFor={method.id}
                                    className="cursor-pointer font-normal"
                                  >
                                    {t(
                                      method.id as
                                        | "ghn"
                                        | "ghtk"
                                        | "viettelpost"
                                    )}
                                  </Label>
                                </div>
                                <span className="text-sm font-medium">
                                  {cost === 0 ? "Free" : formatVND(cost)}
                                </span>
                              </div>
                            );
                          })}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <Separator />

              {/* Payment */}
              <section className="space-y-4">
                <h2 className="font-semibold text-lg">{t("payment_method")}</h2>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={(val) => field.onChange(val)}
                          className="space-y-2"
                        >
                          {(
                            [
                              { id: "vietqr", label: t("vietqr") },
                              { id: "momo", label: t("momo") },
                              { id: "zalopay", label: t("zalopay") },
                            ] as const
                          ).map((method) => (
                            <div
                              key={method.id}
                              className="flex items-center gap-3 border border-border rounded-lg p-3 cursor-pointer hover:border-primary/50 transition-colors"
                            >
                              <RadioGroupItem
                                value={method.id}
                                id={`pay-${method.id}`}
                              />
                              <Label
                                htmlFor={`pay-${method.id}`}
                                className="cursor-pointer font-normal"
                              >
                                {method.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>
            </div>

            {/* Right: order summary */}
            <aside>
              <div className="border border-border rounded-xl p-4 space-y-4 sticky top-24">
                <h2 className="font-semibold">{t("order_summary")}</h2>
                <Separator />

                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-secondary shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ×{item.quantity}
                        </p>
                      </div>
                      <p className="text-xs font-bold shrink-0">
                        {formatVND(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {tCart("subtotal")}
                    </span>
                    <span>{formatVND(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {tCart("shipping")}
                    </span>
                    <span>
                      {shippingCost === 0 ? "Free" : formatVND(shippingCost)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>{tCart("total")}</span>
                    <span>{formatVND(total)}</span>
                  </div>
                </div>

                {serverError && (
                  <p className="text-sm text-destructive">{serverError}</p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? t("processing")
                    : t("place_order")}
                </Button>
              </div>
            </aside>
          </div>
        </form>
      </Form>
    </div>
  );
}
