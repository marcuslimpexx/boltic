"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
}

const SIZE_MAP = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function StarRating({
  value,
  onChange,
  size = "md",
  readOnly = false,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div
      className="flex items-center gap-0.5"
      role={readOnly ? undefined : "radiogroup"}
      aria-label="Star rating"
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(starValue)}
            onMouseEnter={() => { if (!readOnly) setHovered(starValue); }}
            onMouseLeave={() => { if (!readOnly) setHovered(0); }}
            aria-label={`${starValue} star`}
            className={cn(
              "transition-colors",
              readOnly ? "cursor-default" : "cursor-pointer"
            )}
          >
            <Star
              className={cn(
                SIZE_MAP[size],
                starValue <= active
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-border"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
