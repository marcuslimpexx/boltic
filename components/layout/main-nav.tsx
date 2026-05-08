import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface MainNavProps {
  className?: string;
}

const navLinks = [
  { href: "/products", labelKey: "products" as const },
  { href: "/about", labelKey: "about" as const },
  { href: "/contact", labelKey: "contact" as const },
] as const;

export function MainNav({ className }: MainNavProps) {
  const t = useTranslations("nav");

  return (
    <nav
      className={cn("flex items-center gap-6", className)}
      aria-label="Main navigation"
    >
      {navLinks.map(({ href, labelKey }) => (
        <Link
          key={href}
          href={href}
          className="text-sm font-medium text-muted hover:text-foreground transition-colors"
        >
          {t(labelKey)}
        </Link>
      ))}
    </nav>
  );
}
