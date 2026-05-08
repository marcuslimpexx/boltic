"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleWishlistAction } from "@/lib/wishlist/actions";

interface WishlistButtonProps {
  productId: string;
  productSlug?: string;
  isFavorited?: boolean;
  className?: string;
  size?: "sm" | "default";
}

export function WishlistButton({
  productId,
  productSlug = "",
  isFavorited: initialFavorited = false,
  className,
  size = "default",
}: WishlistButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await toggleWishlistAction(productId, productSlug);
      if (!result.error) {
        setIsFavorited(result.isFavorited);
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "rounded-full transition-colors",
        isFavorited
          ? "text-red-500"
          : "text-muted-foreground hover:text-red-500",
        className
      )}
    >
      <Heart
        className={cn(
          size === "sm" ? "h-4 w-4" : "h-5 w-5",
          isFavorited && "fill-current"
        )}
      />
    </Button>
  );
}
