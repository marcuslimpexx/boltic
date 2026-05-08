import Link from "next/link";
import { cn } from "@/lib/utils";

interface BolticLogoProps {
  className?: string;
  variant?: "dark" | "light" | "indigo";
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { text: "text-lg", svgHeight: 18, svgWidth: 10 },
  md: { text: "text-2xl", svgHeight: 24, svgWidth: 13 },
  lg: { text: "text-4xl", svgHeight: 36, svgWidth: 20 },
};

const variantMap = {
  dark: { textClass: "text-foreground", boltFill: "#3D2BFF" },
  light: { textClass: "text-white", boltFill: "#FFD60A" },
  indigo: { textClass: "text-primary", boltFill: "#FFD60A" },
};

export function BolticLogo({
  className,
  variant = "dark",
  size = "md",
}: BolticLogoProps) {
  const { text, svgHeight, svgWidth } = sizeMap[size];
  const { textClass, boltFill } = variantMap[variant];

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center font-bold tracking-tight select-none no-underline",
        text,
        textClass,
        className
      )}
      style={{ fontFamily: "var(--font-display)" }}
      aria-label="Boltic — go to homepage"
    >
      {/* "bolt" */}
      <span>bolt</span>

      {/* Custom "i" with lightning bolt dot */}
      <span
        className="relative inline-block"
        style={{ width: `${svgWidth}px`, height: `${svgHeight}px` }}
        aria-hidden="true"
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          width={svgWidth}
          height={svgHeight}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
        >
          {/* i stem — centered */}
          <rect
            x={svgWidth * 0.35}
            y={svgHeight * 0.45}
            width={svgWidth * 0.3}
            height={svgHeight * 0.55}
            fill="currentColor"
          />
          {/* Lightning bolt dot */}
          <path
            d={`
              M ${svgWidth * 0.75} ${svgHeight * 0.02}
              L ${svgWidth * 0.35} ${svgHeight * 0.32}
              L ${svgWidth * 0.55} ${svgHeight * 0.32}
              L ${svgWidth * 0.25} ${svgHeight * 0.55}
              L ${svgWidth * 0.85} ${svgHeight * 0.22}
              L ${svgWidth * 0.6} ${svgHeight * 0.22}
              Z
            `}
            fill={boltFill}
          />
        </svg>
      </span>

      {/* "c" */}
      <span>c</span>
    </Link>
  );
}
