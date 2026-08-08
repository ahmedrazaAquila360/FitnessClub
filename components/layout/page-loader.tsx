import { Dumbbell } from "lucide-react";

export function PageLoader() {
  return (
    <div className="flex min-h-[100svh] w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand/10">
          <span className="absolute inset-0 animate-ping rounded-full bg-brand/20" />
          <Dumbbell className="relative h-6 w-6 animate-pulse text-brand" strokeWidth={2} />
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/40">
          Loading
        </span>
      </div>
    </div>
  );
}
