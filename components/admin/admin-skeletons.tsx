import { Skeleton } from "@/components/ui/skeleton";

function HeaderSkeleton() {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-9 w-32 rounded-full" />
    </div>
  );
}

export function AdminListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div>
      <HeaderSkeleton />
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="flex items-center gap-4 border-b border-white/10 bg-white/2 px-4 py-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-20" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-white/5 px-4 py-4 last:border-0">
            <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="ml-auto h-4 w-16" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminFormSkeleton({ fields = 6 }: { fields?: number }) {
  return (
    <div>
      <HeaderSkeleton />
      <div className="max-w-3xl space-y-6">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        ))}
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </div>
  );
}

export function AdminGridSkeleton({ items = 10 }: { items?: number }) {
  return (
    <div>
      <HeaderSkeleton />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: items }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Skeleton className="h-64 w-full rounded-2xl lg:col-span-2" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
      <Skeleton className="h-72 w-full rounded-2xl" />
    </div>
  );
}
