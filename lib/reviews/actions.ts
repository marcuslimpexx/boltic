"use server";

import { auth } from "@/lib/auth/config";
import { reviewRepo } from "@/lib/data";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const reviewSchema = z.object({
  productId: z.string().min(1),
  productSlug: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  text: z.string().max(2000).optional(),
});

interface SubmitReviewResult {
  success?: boolean;
  error?: string;
}

export async function submitReviewAction(
  data: z.infer<typeof reviewSchema>
): Promise<SubmitReviewResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "login_required" };
  }

  const parsed = reviewSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const existing = await reviewRepo.findByUserAndProduct(
    session.user.id,
    parsed.data.productId
  );
  if (existing) {
    return { error: "already_reviewed" };
  }

  await reviewRepo.create({
    productId: parsed.data.productId,
    userId: session.user.id,
    userName: session.user.name ?? "Anonymous",
    rating: parsed.data.rating,
    text: parsed.data.text ?? null,
    photos: [],
    verifiedPurchase: false,
    status: "published",
    createdAt: new Date().toISOString(),
  });

  revalidatePath(`/products/${parsed.data.productSlug}`);
  return { success: true };
}
