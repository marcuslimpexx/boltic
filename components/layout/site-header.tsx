import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart, User } from "lucide-react";
import { BolticLogo } from "./boltic-logo";
import { MainNav } from "./main-nav";
import { LanguageSwitcher } from "./language-switcher";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search/search-bar";
import { CartButton } from "@/components/cart/cart-button";
import { CartDrawer } from "@/components/cart/cart-drawer";

export function SiteHeader() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        {/* Logo */}
        <BolticLogo size="md" />

        {/* Main nav — hidden on mobile */}
        <MainNav className="hidden md:flex ml-8" />

        {/* Search bar */}
        <div className="flex-1 max-w-sm mx-auto hidden md:flex items-center">
          <SearchBar />
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
          <CartButton />
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
      <CartDrawer />
    </header>
  );
}
