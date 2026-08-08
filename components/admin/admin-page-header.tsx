import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminPageHeader({
  title,
  description,
  action,
  backHref,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
  backHref?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {backHref && (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1.5 text-xs text-foreground/50 hover:text-brand"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
        )}
        <h1 className="heading-font text-2xl tracking-wide">{title}</h1>
        {description && <p className="mt-1 text-sm text-foreground/50">{description}</p>}
      </div>
      {action && (
        <Button
          render={<Link href={action.href} />}
          nativeButton={false}
          className="gap-2 rounded-full bg-brand text-black hover:bg-brand/90"
        >
          <Plus className="h-4 w-4" /> {action.label}
        </Button>
      )}
    </div>
  );
}
