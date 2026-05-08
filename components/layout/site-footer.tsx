import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BolticLogo } from "./boltic-logo";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-foreground text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div className="col-span-2 md:col-span-1">
            <BolticLogo variant="light" />
            <p className="mt-3 text-xs text-white/60">{t("powered_by")}</p>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h3 className="text-sm font-semibold mb-4">{t("shop")}</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  {t("power_banks")}
                </Link>
              </li>
              <li>
                <Link href="/products?sort=newest" className="hover:text-white transition-colors">
                  {t("new_arrivals")}
                </Link>
              </li>
              <li>
                <Link href="/products?sort=best_selling" className="hover:text-white transition-colors">
                  {t("best_sellers")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Help */}
          <div>
            <h3 className="text-sm font-semibold mb-4">{t("help")}</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  {t("shipping_policy")}
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  {t("returns")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="text-sm font-semibold mb-4">{t("legal")}</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  {t("refund")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>{t("copyright")}</p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {(["VietQR", "MoMo", "ZaloPay", "Bank Transfer"] as const).map(
              (method) => (
                <span
                  key={method}
                  className="px-2 py-0.5 border border-white/20 rounded text-white/70 text-xs"
                >
                  {method}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
