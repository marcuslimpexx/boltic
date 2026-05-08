"use server";

import bcrypt from "bcryptjs";
import { userRepo } from "@/lib/data";
import {
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./schemas";
import { signIn } from "./config";
import { AuthError } from "next-auth";

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

  if (user) {
    const stubToken = Buffer.from(`${user.id}:${Date.now()}`).toString(
      "base64"
    );
    console.log(`[AUTH] Password reset token for ${email}: ${stubToken}`);
    console.log(
      `[AUTH] Reset URL: /reset-password?token=${stubToken}`
    );
  }

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
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    const id = parts[0];
    const tsStr = parts[1];
    if (!id || !tsStr) throw new Error("Invalid token format");
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
