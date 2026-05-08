import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { orderRepo } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, Heart, Settings, ChevronRight } from "lucide-react";
import { formatVND } from "@/lib/utils/format";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });
  return { title: t("title") };
}

export default async function AccountPage({ params }: PageProps) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const [recentOrders, t] = await Promise.all([
    orderRepo.findByUserId(session.user.id),
    getTranslations({ locale, namespace: "account" }),
  ]);

  const lastThreeOrders = recentOrders.slice(0, 3);

  const navCards = [
    {
      href: "/account/orders" as const,
      icon: <Package className="h-5 w-5" />,
      title: t("orders"),
      desc: t("orders_desc"),
    },
    {
      href: "/account/wishlist" as const,
      icon: <Heart className="h-5 w-5" />,
      title: t("wishlist"),
      desc: t("wishlist_desc"),
    },
    {
      href: "/account/settings" as const,
      icon: <Settings className="h-5 w-5" />,
      title: t("settings"),
      desc: t("settings_desc"),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          {t("welcome", { name: session.user.name ?? "User" })}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {session.user.email ?? ""}
        </p>
      </div>

      {/* Nav cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {navCards.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {item.icon}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-base mt-2">{item.title}</CardTitle>
                <CardDescription className="text-xs">
                  {item.desc}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      {lastThreeOrders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{t("orders")}</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/account/orders">View all</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {lastThreeOrders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary/30 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.placedAt).toLocaleDateString(
                      locale === "vi" ? "vi-VN" : "en-US"
                    )}{" "}
                    · {order.items.length} item(s)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatVND(order.total)}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {order.status.replace(/_/g, " ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
