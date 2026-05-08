import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BolticLogo } from "./boltic-logo";

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer
      className="text-white mt-auto"
      style={{ background: "#080816" }}
    >
      {/* Top accent line */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(61,43,255,0.6) 30%, rgba(255,214,10,0.6) 70%, transparent 100%)",
        }}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <BolticLogo variant="light" />
            <p className="mt-4 text-xs text-white/45 leading-relaxed max-w-[180px]">
              {t("powered_by")}
            </p>
            <div className="mt-4 flex items-center gap-1.5">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ background: "#FFD60A" }}
              />
              <span className="text-[11px] text-white/40 uppercase tracking-widest">
                Vietnam
              </span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-[0.12em] text-white/90 mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("shop")}
            </h3>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  {t("power_banks")}
                </Link>
              </li>
              <li>
                <Link
                  href="/products?sort=newest"
                  className="hover:text-white transition-colors"
                >
                  {t("new_arrivals")}
                </Link>
              </li>
              <li>
                <Link
                  href="/products?sort=best_selling"
                  className="hover:text-white transition-colors"
                >
                  {t("best_sellers")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-[0.12em] text-white/90 mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("help")}
            </h3>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li>
                <Link
                  href="/legal/shipping"
                  className="hover:text-white transition-colors"
                >
                  {t("shipping_policy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/refund"
                  className="hover:text-white transition-colors"
                >
                  {t("returns")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-[0.12em] text-white/90 mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("legal")}
            </h3>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li>
                <Link
                  href="/legal/terms"
                  className="hover:text-white transition-colors"
                >
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="hover:text-white transition-colors"
                >
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/refund"
                  className="hover:text-white transition-colors"
                >
                  {t("refund")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <p className="text-xs text-white/30">{t("copyright")}</p>

          {/* Payment method logos */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Visa */}
            <svg viewBox="0 0 48 16" width="40" height="14" aria-label="Visa" role="img">
              <rect width="48" height="16" rx="3" fill="#1A1F71" />
              <text x="7" y="12" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="11" fill="white" letterSpacing="1">VISA</text>
            </svg>

            {/* Mastercard */}
            <svg viewBox="0 0 38 24" width="36" height="22" aria-label="Mastercard" role="img">
              <rect width="38" height="24" rx="4" fill="#252525" />
              <circle cx="14" cy="12" r="7" fill="#EB001B" />
              <circle cx="24" cy="12" r="7" fill="#F79E1B" />
              <path d="M19 6.8a7 7 0 0 1 0 10.4A7 7 0 0 1 19 6.8z" fill="#FF5F00" />
            </svg>

            {/* Amex */}
            <svg viewBox="0 0 48 16" width="40" height="14" aria-label="American Express" role="img">
              <rect width="48" height="16" rx="3" fill="#2E77BC" />
              <text x="4" y="12" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="10" fill="white" letterSpacing="0.5">AMEX</text>
            </svg>

            {/* VietQR */}
            <span
              className="px-2 py-0.5 rounded text-[11px] font-medium"
              style={{ border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.55)" }}
            >
              VietQR
            </span>

            {/* MoMo */}
            <span
              className="px-2 py-0.5 rounded text-[11px] font-medium"
              style={{ background: "#A50064", color: "white" }}
            >
              MoMo
            </span>

            {/* ZaloPay */}
            <span
              className="px-2 py-0.5 rounded text-[11px] font-medium"
              style={{ background: "#0068FF", color: "white" }}
            >
              ZaloPay
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
