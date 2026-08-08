import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

const PERIOD_LABEL: Record<string, string> = {
  MONTHLY: "/ month",
  QUARTERLY: "/ quarter",
  YEARLY: "/ year",
};

export function PlanCard({
  plan,
}: {
  plan: {
    id: string;
    name: string;
    price: string | number;
    billingPeriod: string;
    description: string;
    features: string[];
    ctaLabel: string;
    ctaHref: string;
    badge: string | null;
    isFeatured: boolean;
  };
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-3xl border p-8 transition-transform duration-500 hover:-translate-y-1.5",
        plan.isFeatured
          ? "glow-brand border-brand/40 bg-gradient-to-b from-brand/10 to-transparent"
          : "border-white/10 bg-white/2"
      )}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-8 inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
          <Sparkles className="h-3 w-3" />
          {plan.badge}
        </span>
      )}

      <h3 className="heading-font text-2xl tracking-wide">{plan.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/60">{plan.description}</p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="heading-font text-5xl">{formatCurrency(plan.price)}</span>
        <span className="text-sm text-foreground/50">
          {PERIOD_LABEL[plan.billingPeriod] ?? ""}
        </span>
      </div>

      <ul className="mt-8 flex-1 space-y-3.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-foreground/75">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/15">
              <Check className="h-2.5 w-2.5 text-brand" strokeWidth={3} />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={plan.ctaHref}
        className={cn(
          "mt-8 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition-transform hover:scale-[1.02]",
          plan.isFeatured
            ? "bg-brand text-black"
            : "border border-white/15 text-foreground hover:border-brand hover:text-brand"
        )}
      >
        {plan.ctaLabel}
      </Link>
    </div>
  );
}
