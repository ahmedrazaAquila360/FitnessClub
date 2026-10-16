"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The admin dashboard is a data-dense tool with its own independently
  // scrolling panes (sidebar, main content), not a cinematic marketing page —
  // Lenis's global wheel-capture was swallowing scroll input meant for those
  // nested panes, so it's disabled there entirely.
  const isAdmin = pathname?.startsWith("/admin");
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (isAdmin) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      autoRaf: false,
      // Touch scrolling stays native — Lenis smoothing touch input is what
      // makes mobile scrolling feel "off".
      syncTouch: false,
      // Lets elements with their own overflow (dropdowns, sheets, modals)
      // scroll natively instead of Lenis swallowing the wheel event meant
      // for them at the document level.
      allowNestedScroll: true,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    // Lenis owns the scroll position, so Next's native hash scrolling
    // ("/#about") gets overwritten on the next frame and the page never
    // moves. Route hash links through Lenis instead.
    const HEADER_OFFSET = -80;
    const scrollToHash = (hash: string) => {
      const el = hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      if (!el) return false;
      lenis.scrollTo(el, { offset: HEADER_OFFSET });
      return true;
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || !url.hash) return;
      if (url.pathname !== window.location.pathname || url.search !== window.location.search) return;
      if (!scrollToHash(url.hash)) return;
      // Same-page anchor: handle it here so Next doesn't also navigate/scroll.
      e.preventDefault();
      window.history.pushState(null, "", url.pathname + url.search + url.hash);
    };
    document.addEventListener("click", onClick, true);


    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      document.removeEventListener("click", onClick, true);
      lenisRef.current = null;
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [isAdmin]);

  // Arriving from another page via "/#about": wait for the new page to mount,
  // then scroll through Lenis (Next's own hash scroll is overwritten by it).
  useEffect(() => {
    const { hash } = window.location;
    if (!hash || hash.length < 2) return;
    const timer = window.setTimeout(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) lenisRef.current?.scrollTo(el, { offset: -80 });
    }, 150);
    return () => clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
}
