import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { productRepo, orderRepo } from "@/lib/data";
import { formatVND } from "@/lib/utils/format";
import { Package, ShoppingBag, TrendingUp, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = { title: "Admin Dashboard — Boltic" };

export default async function AdminDashboardPage({ params }: PageProps) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect(`/${locale}/login`);
  }

  const [productsResult, allOrders] = await Promise.all([
    productRepo.findAll({ pageSize: 1 }),
    orderRepo.findByUserId(""),
  ]);

  // NOTE: IOrderRepository.findByUserId requires a userId.
  // For admin stats, the mock returns [] for empty userId; real totals will
  // come from proper admin queries in the Prisma implementation (Phase 7).

  const totalProducts = productsResult.total;
  const totalOrders = allOrders.length;
  const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    {
      label: "Total Products",
      value: totalProducts.toLocaleString(),
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Total Revenue",
      value: formatVND(totalRevenue),
      icon: DollarSign,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Active Products",
      value: productsResult.total.toLocaleString(),
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your store
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/admin/products"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Package className="h-4 w-4" />
              Manage Products
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ShoppingBag className="h-4 w-4" />
              View Orders
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data Layer</span>
                <span className="text-green-600 font-medium">
                  {process.env.DATABASE_URL ? "PostgreSQL" : "In-memory mock"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Provider</span>
                <span className="font-medium capitalize">
                  {process.env.PAYMENT_PROVIDER ?? "stub"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">
                  {process.env.RESEND_API_KEY ? "Resend" : "Console stub"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
