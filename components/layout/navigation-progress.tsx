"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// A top progress bar driven by real link clicks rather than a Suspense
// loading.tsx boundary. Route-level loading.tsx would work too, but for
// any segment that can call notFound() (dynamic slugs), the Suspense
// fallback commits an HTTP 200 before the deferred notFound() resolves,
// permanently breaking the real 404 status code. This click-based
// approach gives instant feedback on every navigation — including
// pagination, which only changes search params — without touching
// server rendering or status codes at all.
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hides the bar once the route has actually changed
    setVisible(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (/^https?:\/\//.test(href) && !href.startsWith(window.location.origin)) return;

      setVisible(true);
      clearTimeout(hideTimeout.current);
      hideTimeout.current = setTimeout(() => setVisible(false), 5000);
    }

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      clearTimeout(hideTimeout.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-300 h-0.5 overflow-hidden bg-transparent">
      <div className="h-full w-1/3 animate-nav-progress bg-brand" />
    </div>
  );
}
