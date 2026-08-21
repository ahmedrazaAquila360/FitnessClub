"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItem = {
  id: string;
  label: string;
  href: string;
  isExternal: boolean;
};

export function Navbar({
  navItems,
  brandName,
  logoUrl,
  ctaLabel,
  ctaHref,
}: {
  navItems: NavItem[];
  brandName: string;
  logoUrl: string | null;
  ctaLabel: string;
  ctaHref: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- closes the mobile menu on route change
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "py-3" : "py-6"
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 transition-all duration-500 sm:px-6",
            scrolled
              ? "glass w-[calc(100%-2rem)] shadow-2xl shadow-black/40 sm:w-[calc(100%-4rem)]"
              : "bg-transparent"
          )}
        >
          <Link
            href="/"
            className="group flex items-center gap-2.5 py-3"
            data-cursor="link"
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={brandName}
                width={36}
                height={36}
                className="h-8 w-8 object-contain sm:h-9 sm:w-9"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-black sm:h-9 sm:w-9">
                <Dumbbell className="h-4 w-4" strokeWidth={2.5} />
              </span>
            )}
            <span className="heading-font text-lg tracking-wide sm:text-xl">
              {brandName}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                target={item.isExternal ? "_blank" : undefined}
                className={cn(
                  "group relative px-4 py-2 text-sm font-medium tracking-wide text-foreground/80 transition-colors hover:text-foreground",
                  isActive(item.href) && "text-foreground"
                )}
                data-cursor="link"
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100",
                    isActive(item.href) && "scale-x-100"
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              render={<Link href={ctaHref} data-cursor="link" />}
              nativeButton={false}
              className="hidden rounded-full bg-brand px-5 text-xs font-bold uppercase tracking-wider text-black hover:bg-brand/90 sm:inline-flex"
            >
              {ctaLabel}
            </Button>
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col bg-background lg:hidden"
          >
            <div className="flex shrink-0 items-center justify-between px-5 py-4 sm:px-6 sm:py-6">
              <span className="heading-font text-base tracking-wide sm:text-lg">{brandName}</span>
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 sm:h-10 sm:w-10"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col items-start justify-center gap-0.5 overflow-y-auto px-6 py-4 sm:gap-1 sm:px-8">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    className="heading-font block py-1.5 text-3xl tracking-wide text-foreground/90 transition-colors hover:text-brand sm:py-3 sm:text-4xl md:text-5xl"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * navItems.length + 0.15, duration: 0.5 }}
                className="mt-6 sm:mt-8"
              >
                <Button
                  render={<Link href={ctaHref} />}
                  nativeButton={false}
                  size="lg"
                  className="rounded-full bg-brand px-6 font-bold uppercase text-black hover:bg-brand/90 sm:px-8"
                >
                  {ctaLabel}
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
