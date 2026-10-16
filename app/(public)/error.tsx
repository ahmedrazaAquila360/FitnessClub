"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function PublicError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center gap-6 px-6 text-center">
      <h2 className="heading-font text-3xl">Something went wrong</h2>
      <p className="max-w-md text-foreground/60">
        This page failed to load. Try again, or head back to the homepage.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => retry()}
          className="rounded-full bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wider text-black"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-foreground/20 px-6 py-3 text-sm font-bold uppercase tracking-wider"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
