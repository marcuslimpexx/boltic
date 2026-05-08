"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth/config";
import { userRepo } from "@/lib/data";
import { revalidatePath } from "next/cache";

const updateProfileSchema = z.object({
  name: z.string().min(1).max(80),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(100),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "passwords_no_match",
    path: ["confirmPassword"],
  });

export type UpdateProfileResult = { success: true } | { error: string };
export type ChangePasswordResult = { success: true } | { error: string };

export async function updateProfileAction(
  _prev: UpdateProfileResult | null,
  formData: FormData
): Promise<UpdateProfileResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const parsed = updateProfileSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await userRepo.update(session.user.id, { name: parsed.data.name });
  revalidatePath("/account");
  revalidatePath("/account/settings");
  return { success: true };
}

export async function changePasswordAction(
  _prev: ChangePasswordResult | null,
  formData: FormData
): Promise<ChangePasswordResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await userRepo.findById(session.user.id);
  if (!user?.passwordHash) return { error: "Account not found" };

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) return { error: "wrong_password" };

  const newHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await userRepo.updatePassword(session.user.id, newHash);
  return { success: true };
}
