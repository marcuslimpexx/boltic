import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Skeleton className="h-7 w-64 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
