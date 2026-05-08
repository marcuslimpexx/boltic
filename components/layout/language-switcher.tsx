"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const next = locale === "vi" ? "en" : "vi";
    router.replace(pathname, { locale: next });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      className="text-sm font-medium w-10"
      aria-label={t("switch_language")}
    >
      {locale === "vi" ? "EN" : "VI"}
    </Button>
  );
}
