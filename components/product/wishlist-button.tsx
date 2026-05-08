"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  isFavorited?: boolean;
  className?: string;
  size?: "sm" | "default";
}

export function WishlistButton({
  productId: _productId,
  isFavorited = false,
  className,
  size = "default",
}: WishlistButtonProps) {
  const handleClick = () => {
    // TODO Phase 4: call wishlistRepo via server action
    console.log("[WISHLIST] Toggle wishlist stub — productId:", _productId);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "rounded-full",
        isFavorited ? "text-red-500" : "text-muted-foreground hover:text-red-500",
        className
      )}
    >
      <Heart className={cn("h-5 w-5", isFavorited && "fill-current")} />
    </Button>
  );
}
