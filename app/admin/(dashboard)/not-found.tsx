import Link from "next/link";
import { SearchX, ArrowRight } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-foreground/40">
        <SearchX className="h-6 w-6" />
      </span>
      <h1 className="heading-font text-2xl tracking-wide">RECORD NOT FOUND</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-foreground/50">
        This item may have been deleted, or the link you followed is out of date.
      </p>
      <Link
        href="/admin"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition-transform hover:scale-[1.03]"
      >
        Back to Dashboard
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
