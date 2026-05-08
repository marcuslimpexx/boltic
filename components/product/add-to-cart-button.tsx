"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  productId: string;
  label?: string;
  variant?: "default" | "outline";
  className?: string;
  disabled?: boolean;
}

export function AddToCartButton({
  productId: _productId,
  label = "Add to cart",
  variant = "default",
  className,
  disabled = false,
}: AddToCartButtonProps) {
  const handleClick = () => {
    // TODO Phase 3: dispatch to Zustand cart store
    console.log("[CART] Add to cart stub — productId:", _productId);
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      className={cn("gap-2", className)}
      disabled={disabled}
    >
      <ShoppingCart className="h-4 w-4" />
      {label}
    </Button>
  );
}
