"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";

interface AddToCartButtonProps {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  label?: string;
  variant?: "default" | "outline";
  className?: string;
  disabled?: boolean;
}

export function AddToCartButton({
  productId,
  slug,
  name,
  image,
  price,
  label = "Add to cart",
  variant = "default",
  className,
  disabled = false,
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleClick = () => {
    addItem({ productId, slug, name, image, price });
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
