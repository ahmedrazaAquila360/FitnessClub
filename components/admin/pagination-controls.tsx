import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Plain <a> tags are used intentionally instead of next/link: a full
// navigation guarantees the nearest loading.tsx boundary fires and the
// page re-renders with fresh data every time, which matters more here
// than a soft client transition for a simple prev/next control.

export function PaginationControls({
  basePath,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}) {
  if (totalPages <= 1) return null;

  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const linkClass =
    "flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-foreground/70 transition-colors hover:border-brand/40 hover:text-brand";
  const disabledClass = "flex h-9 w-9 items-center justify-center rounded-lg text-foreground/20";

  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <p className="text-xs text-foreground/45">
        Showing {from}–{to} of {totalItems}
      </p>
      <div className="flex items-center gap-2">
        {hasPrev ? (
          <a href={`${basePath}?page=${currentPage - 1}`} className={linkClass} aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </a>
        ) : (
          <span className={disabledClass}>
            <ChevronLeft className="h-4 w-4" />
          </span>
        )}
        <span className="px-2 text-xs font-medium text-foreground/60">
          Page {currentPage} of {totalPages}
        </span>
        {hasNext ? (
          <a href={`${basePath}?page=${currentPage + 1}`} className={linkClass} aria-label="Next page">
            <ChevronRight className="h-4 w-4" />
          </a>
        ) : (
          <span className={cn(disabledClass)}>
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </div>
  );
}
