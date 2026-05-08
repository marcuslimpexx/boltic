"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const mainImage = images[selectedIdx] ?? images[0] ?? "/placeholder-product.jpg";

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="aspect-square rounded-lg overflow-hidden bg-secondary border border-border">
        <Image
          src={mainImage}
          alt={productName}
          width={600}
          height={600}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={cn(
                "shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors",
                selectedIdx === idx
                  ? "border-primary"
                  : "border-border hover:border-muted"
              )}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
