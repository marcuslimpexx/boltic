import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { productRepo } from "@/lib/data";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Truck, ChevronRight } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const CATEGORY_CARDS = [
  {
    slug: "compact",
    emoji: "⚡",
    labelVi: "Nhỏ gọn",
    labelEn: "Compact",
    sub: "≤10,000 mAh",
    color: "from-blue-600/20 to-indigo-600/10",
    accent: "#3D2BFF",
  },
  {
    slug: "standard",
    emoji: "🔋",
    labelVi: "Tiêu chuẩn",
    labelEn: "Standard",
    sub: "10,001–20,000 mAh",
    color: "from-teal-600/20 to-cyan-600/10",
    accent: "#0EA5E9",
  },
  {
    slug: "high-capacity",
    emoji: "💪",
    labelVi: "Dung lượng cao",
    labelEn: "High Capacity",
    sub: "20,001–30,000 mAh",
    color: "from-amber-500/20 to-orange-500/10",
    accent: "#F59E0B",
  },
  {
    slug: "mega",
    emoji: "🚀",
    labelVi: "Siêu lớn",
    labelEn: "Mega",
    sub: ">30,000 mAh",
    color: "from-red-600/20 to-rose-600/10",
    accent: "#EF4444",
  },
] as const;

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const [t, featuredResult] = await Promise.all([
    getTranslations({ locale, namespace: "home" }),
    productRepo.findAll({ sort: "best_selling", pageSize: 8 }),
  ]);

  const totalProducts = featuredResult.total;

  const stats = [
    {
      value: `${totalProducts}+`,
      label: locale === "vi" ? "Sản phẩm" : "Products",
    },
    {
      value: locale === "vi" ? "Miễn phí" : "Free Ship",
      label: locale === "vi" ? "Giao hàng từ 1 triệu" : "Orders over 1M VND",
    },
    {
      value: "100%",
      label: locale === "vi" ? "Chính hãng" : "Genuine",
    },
    {
      value: locale === "vi" ? "Hôm nay" : "Same-day",
      label: locale === "vi" ? "Giao nội thành HCM" : "Delivery in HCMC",
    },
  ];

  const valueProps = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: locale === "vi" ? "Sạc nhanh" : "Fast Charging",
      desc:
        locale === "vi"
          ? "Hỗ trợ sạc nhanh 18W–65W"
          : "Products supporting 18W–65W fast charging",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: locale === "vi" ? "Hàng chính hãng" : "Genuine Products",
      desc:
        locale === "vi"
          ? "100% sản phẩm chính hãng, bảo hành chính thức"
          : "100% genuine with official manufacturer warranty",
    },
    {
      icon: <Truck className="h-5 w-5" />,
      title: locale === "vi" ? "Giao hàng toàn quốc" : "Nationwide Delivery",
      desc:
        locale === "vi"
          ? "GHN · GHTK · ViettelPost"
          : "Delivered via GHN · GHTK · ViettelPost",
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section
        className="relative min-h-[70vh] sm:min-h-[88vh] flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% -10%, rgba(61,43,255,0.45) 0%, rgba(61,43,255,0.1) 40%, transparent 70%), #080816",
        }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Faint diagonal lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 container mx-auto px-4 py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/60 text-xs font-medium uppercase tracking-widest mb-8">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse"
            />
            {locale === "vi"
              ? "Sản phẩm mới mỗi tuần"
              : "New arrivals every week"}
          </div>

          {/* Headline */}
          <h1
            className="text-[clamp(3rem,9vw,7rem)] font-bold leading-[1.0] tracking-[-0.03em] text-white mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {locale === "vi" ? (
              <>
                Năng lượng,{" "}
                <span
                  className="relative inline-block"
                  style={{ color: "#FFD60A" }}
                >
                  Luôn sẵn.
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, #FFD60A, transparent)",
                    }}
                  />
                </span>
              </>
            ) : (
              <>
                Power,{" "}
                <span
                  className="relative inline-block"
                  style={{ color: "#FFD60A" }}
                >
                  Delivered.
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, #FFD60A, transparent)",
                    }}
                  />
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-white/60 text-lg md:text-xl max-w-lg mx-auto mb-10 leading-relaxed">
            {t("hero_subtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-base font-semibold rounded-lg text-foreground"
              style={{ background: "#FFD60A", color: "#0A0A0A" }}
            >
              <Link href="/products">
                {t("hero_cta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base rounded-lg border-white/20 text-white bg-transparent hover:bg-white/10 hover:text-white"
            >
              <Link href="/categories/power-banks">
                {locale === "vi" ? "Xem danh mục" : "Browse categories"}
              </Link>
            </Button>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-white/50 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ─── TRUST STRIP ───────────────────────────────────────── */}
      <section className="border-y border-border bg-surface">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {locale === "vi" ? "Vận chuyển:" : "Shipping:"}
            </span>
            {["GHN", "GHTK", "ViettelPost"].map((p) => (
              <span key={p} className="font-semibold tracking-wide uppercase">
                {p}
              </span>
            ))}
            <span className="hidden sm:block h-4 w-px bg-border" />
            <span className="font-medium text-foreground">
              {locale === "vi" ? "Thanh toán:" : "Payment:"}
            </span>
            {["MoMo", "ZaloPay", "VNPay", "Bank Transfer"].map((p) => (
              <span key={p} className="font-semibold tracking-wide">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─────────────────────────────────── */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-2">
              {locale === "vi" ? "Nổi bật" : "Featured"}
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-foreground leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("featured_title")}
            </h2>
          </div>
          <Button
            variant="ghost"
            asChild
            className="hidden sm:flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <Link href="/products">
              {locale === "vi" ? "Xem tất cả" : "View all"}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <ProductGrid products={featuredResult.items} locale={locale} />
        <div className="mt-8 flex justify-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/products">
              {locale === "vi" ? "Xem tất cả sản phẩm" : "View all products"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ─── CATEGORIES ────────────────────────────────────────── */}
      <section
        className="py-16 relative overflow-hidden"
        style={{ background: "#0D0D1A" }}
      >
        {/* Background accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 80% at 0% 50%, rgba(61,43,255,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-2">
              {locale === "vi" ? "Khám phá" : "Browse"}
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("categories_title")}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORY_CARDS.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className={`group relative block p-4 sm:p-6 rounded-xl border border-white/10 bg-gradient-to-br ${cat.color} hover:border-white/25 transition-all duration-300 overflow-hidden`}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                  style={{
                    boxShadow: `inset 0 0 40px ${cat.accent}22`,
                  }}
                />

                <div className="relative z-10">
                  <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">{cat.emoji}</div>
                  <p
                    className="font-bold text-white text-base sm:text-lg leading-tight mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {locale === "vi" ? cat.labelVi : cat.labelEn}
                  </p>
                  <p className="text-xs text-white/50 font-mono">{cat.sub}</p>
                </div>

                <ChevronRight
                  className="absolute bottom-4 right-4 h-4 w-4 text-white/30 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VALUE PROPS ───────────────────────────────────────── */}
      <section className="border-t border-border bg-surface">
        <div className="container mx-auto px-4 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {valueProps.map((prop) => (
              <div key={prop.title} className="flex items-start gap-4">
                <div
                  className="shrink-0 h-10 w-10 rounded-lg flex items-center justify-center text-primary"
                  style={{ background: "rgba(61,43,255,0.08)" }}
                >
                  {prop.icon}
                </div>
                <div>
                  <h3
                    className="font-bold text-base text-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {prop.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {prop.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
