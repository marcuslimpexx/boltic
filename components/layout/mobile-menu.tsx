"use client";

import { useState } from "react";
import { Menu, X, Search, Heart, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BolticLogo } from "./boltic-logo";
import { SearchBar } from "@/components/search/search-bar";
import { LanguageSwitcher } from "./language-switcher";

const navLinks = [
  { href: "/products", labelKey: "products" as const },
  { href: "/about", labelKey: "about" as const },
  { href: "/contact", labelKey: "contact" as const },
] as const;

export function MobileMenu() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[280px] sm:w-[320px] flex flex-col gap-0 p-0">
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border">
          <SheetTitle asChild>
            <BolticLogo size="md" onClick={() => setOpen(false)} />
          </SheetTitle>
        </SheetHeader>

        {/* Search */}
        <div className="px-5 py-4 border-b border-border">
          <SearchBar />
        </div>

        {/* Nav links */}
        <nav className="flex flex-col px-3 py-4 gap-1 flex-1" aria-label="Mobile navigation">
          {navLinks.map(({ href, labelKey }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {t(labelKey)}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-5 py-4 border-t border-border flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="flex-1 gap-2">
            <Link href="/account" onClick={() => setOpen(false)}>
              <User className="h-4 w-4" />
              {t("account")}
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="flex-1 gap-2">
            <Link href="/account/wishlist" onClick={() => setOpen(false)}>
              <Heart className="h-4 w-4" />
              {t("wishlist")}
            </Link>
          </Button>
          <LanguageSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  );
}
