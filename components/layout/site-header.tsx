import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ShoppingCart, Heart, User, Search } from "lucide-react";
import { BolticLogo } from "./boltic-logo";
import { MainNav } from "./main-nav";
import { LanguageSwitcher } from "./language-switcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SiteHeader() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        {/* Logo */}
        <BolticLogo size="md" />

        {/* Main nav — hidden on mobile */}
        <MainNav className="hidden md:flex ml-8" />

        {/* Search bar — hidden on mobile */}
        <div className="flex-1 max-w-sm mx-auto hidden md:flex items-center">
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder={t("search")}
              className="pl-9 bg-background"
              aria-label={t("search")}
              readOnly
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("wishlist")}
            asChild
          >
            <Link href="/account/wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("cart")}
            asChild
          >
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("account")}
            asChild
          >
            <Link href="/account">
              <User className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
