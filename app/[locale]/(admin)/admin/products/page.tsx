import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { productRepo } from "@/lib/data";
import { formatVND } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Package, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import type { Product, ProductStatus } from "@/lib/data/types";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; status?: string; q?: string }>;
}

export const metadata: Metadata = { title: "Products — Admin" };

const STATUS_COLORS: Record<ProductStatus, string> = {
  active: "bg-green-100 text-green-700 border-green-200",
  draft: "bg-yellow-100 text-yellow-700 border-yellow-200",
  out_of_stock: "bg-red-100 text-red-700 border-red-200",
};

export default async function AdminProductsPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { page: pageStr, status, q } = await searchParams;

  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect(`/${locale}/login`);
  }

  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);

  const result = await productRepo.findAll({
    page,
    pageSize: 20,
    ...(q ? { search: q } : {}),
    ...(status ? { status: status as ProductStatus } : {}),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {result.total} total products
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-background rounded-lg border border-border p-4 mb-6 flex flex-wrap gap-3">
        {(["", "active", "draft", "out_of_stock"] as const).map((s) => (
          <Link
            key={s || "all"}
            href={s ? `/admin/products?status=${s}` : "/admin/products"}
            className={`text-sm px-3 py-1 rounded-full border transition-colors ${
              (status ?? "") === s
                ? "bg-primary text-white border-primary"
                : "border-border hover:border-primary/40"
            }`}
          >
            {s === "" ? "All" : s.replace(/_/g, " ")}
          </Link>
        ))}
      </div>

      {/* Products table */}
      <div className="bg-background rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Product
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                Brand
              </th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                Price
              </th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                Stock
              </th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {result.items.map((product: Product) => (
              <tr
                key={product.id}
                className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {product.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.images[0]}
                        alt=""
                        className="w-10 h-10 rounded object-cover shrink-0 hidden sm:block"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium truncate max-w-[180px]">
                        {locale === "vi" ? product.name.vi : product.name.en}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {product.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                  {product.brand}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatVND(product.price)}
                </td>
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  <span
                    className={
                      product.stock <= 5 ? "text-red-600 font-medium" : ""
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border font-medium ${
                      STATUS_COLORS[product.status] ?? ""
                    }`}
                  >
                    {product.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/products/${product.slug}`}>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {result.items.length === 0 && (
          <div className="py-16 text-center">
            <Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {result.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {page > 1 && (
            <Link
              href={`/admin/products?page=${page - 1}${status ? `&status=${status}` : ""}`}
            >
              <Button variant="outline" size="sm">
                Previous
              </Button>
            </Link>
          )}
          <span className="flex items-center text-sm text-muted-foreground px-3">
            Page {page} of {result.totalPages}
          </span>
          {page < result.totalPages && (
            <Link
              href={`/admin/products?page=${page + 1}${status ? `&status=${status}` : ""}`}
            >
              <Button variant="outline" size="sm">
                Next
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
