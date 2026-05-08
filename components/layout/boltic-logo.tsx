import Link from "next/link";
import { cn } from "@/lib/utils";

interface BolticLogoProps {
  className?: string;
  variant?: "dark" | "light" | "indigo";
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

const variantMap = {
  dark: { textClass: "text-foreground", accentClass: "text-primary" },
  light: { textClass: "text-white", accentClass: "text-yellow-400" },
  indigo: { textClass: "text-primary", accentClass: "text-yellow-400" },
};

export function BolticLogo({
  className,
  variant = "dark",
  size = "md",
}: BolticLogoProps) {
  const textSize = sizeMap[size];
  const { textClass, accentClass } = variantMap[variant];

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center font-bold tracking-tight select-none no-underline gap-1",
        textSize,
        textClass,
        className
      )}
      style={{ fontFamily: "var(--font-display)" }}
      aria-label="Boltic — go to homepage"
    >
      {/* Lightning bolt icon */}
      <svg
        aria-hidden="true"
        viewBox="0 0 12 20"
        width={size === "sm" ? 10 : size === "md" ? 13 : 18}
        height={size === "sm" ? 16 : size === "md" ? 22 : 30}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M7 0L0 11h5l-2 9L12 9H7L9 0z"
          className={accentClass}
          fill="currentColor"
        />
      </svg>
      <span>Boltic</span>
    </Link>
  );
}
