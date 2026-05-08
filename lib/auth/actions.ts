"use server";

import bcrypt from "bcryptjs";
import { createHmac, timingSafeEqual } from "crypto";
import { userRepo } from "@/lib/data";
import {
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./schemas";
import { signIn } from "./config";
import { AuthError } from "next-auth";
import { sendPasswordResetEmail } from "@/lib/email";

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Validation error",
    };
  }

  const { name, email, password } = parsed.data;
  const existing = await userRepo.findByEmail(email);
  if (existing) {
    return { error: "email_taken" };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await userRepo.create({ email, passwordHash, name });

  // Stub: in production send verification email
  console.log(`[AUTH] New user registered: ${email}`);

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (e) {
    if (e instanceof AuthError) {
      return { error: "Sign-in after registration failed" };
    }
    throw e; // re-throw redirect
  }
}

export async function forgotPasswordAction(formData: FormData) {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: "Invalid email" };
  }

  const { email } = parsed.data;
  const user = await userRepo.findByEmail(email);

  if (!user) {
    // Constant-time operation to prevent timing-based user enumeration
    await bcrypt.hash("constant-time-noop", 10);
    return { success: true };
  }

  const secret = process.env.AUTH_SECRET ?? "dev-secret";
  const payload = `${user.id}:${Date.now()}`;
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  const token = Buffer.from(`${payload}:${sig}`).toString("base64url");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  // The locale is not available in this server action directly; default to "vi" for reset emails
  // (the reset-password page works regardless of locale)
  const resetUrl = `${siteUrl}/vi/reset-password?token=${token}`;
  await sendPasswordResetEmail(email, resetUrl, "vi");

  return { success: true };
}

export async function resetPasswordAction(formData: FormData) {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Validation error",
    };
  }

  const { token, password } = parsed.data;

  let userId: string;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    // Format: userId:timestamp:hmac_signature
    const lastColon = decoded.lastIndexOf(":");
    const payload = decoded.slice(0, lastColon);
    const providedSig = decoded.slice(lastColon + 1);

    const secret = process.env.AUTH_SECRET ?? "dev-secret";
    const expectedSig = createHmac("sha256", secret).update(payload).digest("hex");

    // Constant-time comparison to prevent timing attacks
    const sigBuffer = Buffer.from(providedSig, "hex");
    const expectedBuffer = Buffer.from(expectedSig, "hex");
    if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) {
      return { error: "Invalid or expired token" };
    }

    const parts = payload.split(":");
    const id = parts[0];
    const tsStr = parts[1];
    if (!id || !tsStr) return { error: "Invalid or expired token" };
    const ts = parseInt(tsStr, 10);
    if (Number.isNaN(ts) || Date.now() - ts > 24 * 60 * 60 * 1000) {
      return { error: "Token expired" };
    }
    userId = id;
  } catch {
    return { error: "Invalid or expired token" };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const updated = await userRepo.updatePassword(userId, passwordHash);
  if (!updated) return { error: "User not found" };

  console.log(`[AUTH] Password reset for user: ${userId}`);
  return { success: true };
}
