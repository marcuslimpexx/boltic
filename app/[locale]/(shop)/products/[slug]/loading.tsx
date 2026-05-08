import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Skeleton className="h-4 w-64 mb-6" />
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery skeleton */}
        <div className="space-y-3">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-16 h-16 rounded-md" />
            ))}
          </div>
        </div>
        {/* Info skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
