import { Skeleton } from "@/components/ui/skeleton";

function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-surface">
      <Skeleton className="aspect-square w-full" />
      <div className="p-3.5 space-y-2.5">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-10" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-5 w-28 mt-1" />
        <Skeleton className="h-8 w-full mt-1" />
      </div>
    </div>
  );
}

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex gap-8">
        <div className="hidden lg:block w-64 shrink-0 space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="flex-1">
          <div className="flex justify-end mb-4">
            <Skeleton className="h-9 w-44" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
