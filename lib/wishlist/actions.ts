"use server";

import { auth } from "@/lib/auth/config";
import { wishlistRepo } from "@/lib/data";
import { revalidatePath } from "next/cache";

interface ToggleResult {
  isFavorited: boolean;
  error?: string;
}

export async function toggleWishlistAction(
  productId: string,
  productSlug: string
): Promise<ToggleResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { isFavorited: false, error: "login_required" };
  }

  const has = await wishlistRepo.hasProduct(session.user.id, productId);
  if (has) {
    await wishlistRepo.remove(session.user.id, productId);
    revalidatePath(`/products/${productSlug}`);
    revalidatePath("/account/wishlist");
    return { isFavorited: false };
  } else {
    await wishlistRepo.add(session.user.id, productId);
    revalidatePath(`/products/${productSlug}`);
    revalidatePath("/account/wishlist");
    return { isFavorited: true };
  }
}
