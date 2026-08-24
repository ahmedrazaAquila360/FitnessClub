"use client";

import { useEffect } from "react";
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
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [isAdmin]);

  return <>{children}</>;
}
