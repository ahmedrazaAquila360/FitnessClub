import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        accent ? "border-brand/30 bg-brand/5" : "border-white/10 bg-white/2"
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-foreground/45">
          {label}
        </span>
        <Icon className={cn("h-4 w-4", accent ? "text-brand" : "text-foreground/30")} />
      </div>
      <p className="heading-font text-3xl">{value}</p>
    </div>
  );
}
