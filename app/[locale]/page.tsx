import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { productRepo } from "@/lib/data";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const [t, featuredResult] = await Promise.all([
    getTranslations({ locale, namespace: "home" }),
    productRepo.findAll({ sort: "best_selling", pageSize: 8 }),
  ]);

  const valueProps = [
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: locale === "vi" ? "Sạc nhanh" : "Fast Charging",
      desc:
        locale === "vi"
          ? "Sản phẩm hỗ trợ sạc nhanh 18W–65W"
          : "Products supporting 18W–65W fast charging",
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: locale === "vi" ? "Hàng chính hãng" : "Genuine Products",
      desc:
        locale === "vi"
          ? "100% sản phẩm chính hãng, có bảo hành"
          : "100% genuine with manufacturer warranty",
    },
    {
      icon: <Truck className="h-6 w-6 text-primary" />,
      title: locale === "vi" ? "Giao hàng toàn quốc" : "Nationwide Delivery",
      desc:
        locale === "vi"
          ? "Giao hàng qua GHN, GHTK, ViettelPost"
          : "Delivery via GHN, GHTK, ViettelPost",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-foreground text-white">
        <div className="container mx-auto px-4 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            {t("hero_title")}
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">
            {t("hero_subtitle")}
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/products">
                {t("hero_cta")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Link href="/categories/power-banks">Power Banks</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueProps.map((prop) => (
              <div key={prop.title} className="flex items-start gap-4">
                <div className="shrink-0 p-2 bg-primary/10 rounded-lg">
                  {prop.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{prop.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{prop.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t("featured_title")}</h2>
          <Button variant="ghost" asChild>
            <Link href="/products" className="gap-1">
              {locale === "vi" ? "Xem tất cả" : "View all"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <ProductGrid products={featuredResult.items} locale={locale} />
      </section>

      {/* Category tiles */}
      <section className="bg-secondary">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">{t("categories_title")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(
              [
                {
                  slug: "compact",
                  label: locale === "vi" ? "Nhỏ gọn" : "Compact",
                  sub: "≤10,000 mAh",
                },
                {
                  slug: "standard",
                  label: locale === "vi" ? "Tiêu chuẩn" : "Standard",
                  sub: "10,001–20,000 mAh",
                },
                {
                  slug: "high-capacity",
                  label: locale === "vi" ? "Dung lượng cao" : "High Capacity",
                  sub: "20,001–30,000 mAh",
                },
                {
                  slug: "mega",
                  label: locale === "vi" ? "Siêu lớn" : "Mega",
                  sub: ">30,000 mAh",
                },
              ] as const
            ).map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group block p-5 bg-background rounded-xl border border-border hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <p className="font-semibold group-hover:text-primary transition-colors">
                  {cat.label}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{cat.sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
