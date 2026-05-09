import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart, User } from "lucide-react";
import { BolticLogo } from "./boltic-logo";
import { MainNav } from "./main-nav";
import { MobileMenu } from "./mobile-menu";
import { LanguageSwitcher } from "./language-switcher";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search/search-bar";
import { CartButton } from "@/components/cart/cart-button";
import { CartDrawer } from "@/components/cart/cart-drawer";

export function SiteHeader() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/90 backdrop-blur-md supports-[backdrop-filter]:bg-surface/70">
      <div className="container mx-auto flex h-[60px] items-center gap-2 px-4">
        {/* Hamburger — mobile only */}
        <MobileMenu />

        {/* Logo */}
        <BolticLogo size="md" />

        {/* Main nav — desktop only */}
        <MainNav className="hidden md:flex ml-4" />

        {/* Search — desktop only */}
        <div className="flex-1 max-w-xs mx-auto hidden md:flex items-center">
          <SearchBar />
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-0.5">
          {/* Language + wishlist + account — desktop only */}
          <span className="hidden md:contents">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("wishlist")}
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/account/wishlist">
                <Heart className="h-[18px] w-[18px]" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("account")}
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/account">
                <User className="h-[18px] w-[18px]" />
              </Link>
            </Button>
          </span>

          {/* Cart is always visible */}
          <CartButton />
        </div>
      </div>
      <CartDrawer />
    </header>
  );
}
