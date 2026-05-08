import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { BolticLogo } from "@/components/layout/boltic-logo";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const navItems = [
  { href: "/admin" as const, label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products" as const, label: "Products", icon: Package },
  { href: "/admin/orders" as const, label: "Orders", icon: ShoppingBag },
] as const;

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-foreground text-white flex flex-col">
        <div className="p-4 border-b border-white/10">
          <BolticLogo variant="light" />
          <p className="text-xs text-white/40 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Back to site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-secondary min-h-screen overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
