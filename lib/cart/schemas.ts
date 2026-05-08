import { z } from "zod";

export const shippingMethods = [
  {
    id: "ghn",
    courier: "GHN",
    rate: 25000,
    etaDays: 4,
  },
  {
    id: "ghtk",
    courier: "GHTK",
    rate: 20000,
    etaDays: 5,
  },
  {
    id: "viettelpost",
    courier: "ViettelPost",
    rate: 22000,
    etaDays: 4,
  },
] as const;

export type ShippingMethodId = (typeof shippingMethods)[number]["id"];

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^(0|\+84)[0-9]{9,10}$/, "Invalid Vietnamese phone number"),
  email: z.string().email("Invalid email address"),
  addressLine1: z.string().min(5, "Address must be at least 5 characters"),
  addressLine2: z.string().optional(),
  ward: z.string().min(1, "Ward is required"),
  district: z.string().min(1, "District is required"),
  province: z.string().min(1, "Province is required"),
  shippingMethodId: z.enum(["ghn", "ghtk", "viettelpost"]),
  paymentMethod: z.enum(["bank_transfer", "vietqr", "momo", "zalopay"]),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
