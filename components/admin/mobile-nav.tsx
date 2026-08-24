"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NAV_GROUPS } from "@/components/admin/sidebar";
import type { Role } from "@prisma/client";

export function AdminMobileNav({ role, onNavigate }: { role: Role; onNavigate: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between gap-2 border-b border-white/10 pl-6 pr-3">
        <span className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-black">
            <Dumbbell className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="heading-font text-sm tracking-wide">APEX ADMIN</span>
        </span>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close menu"
          onClick={onNavigate}
          className="text-foreground/60 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
        {NAV_GROUPS.map((group) => {
          const items = group.items.filter((item) => !item.roles || item.roles.includes(role));
          if (items.length === 0) return null;
          return (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/35">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const isActive =
                    item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-brand/15 text-brand"
                          : "text-foreground/60 hover:bg-white/5 hover:text-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-brand transition-opacity duration-150",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
