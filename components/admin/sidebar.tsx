"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Dumbbell,
  CreditCard,
  Users,
  CalendarDays,
  Building2,
  Sparkles,
  Star,
  Image as ImageIcon,
  HelpCircle,
  MessageSquare,
  Palette,
  Search,
  Settings,
  ShieldCheck,
  History,
  Navigation as NavigationIcon,
  Info,
  Wand2,
  MegaphoneIcon,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@prisma/client";

export type NavGroup = {
  label: string;
  items: { href: string; label: string; icon: typeof LayoutDashboard; roles?: Role[] }[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/programs", label: "Programs", icon: Dumbbell },
      { href: "/admin/memberships", label: "Memberships", icon: CreditCard },
      { href: "/admin/trainers", label: "Trainers", icon: Users },
      { href: "/admin/schedule", label: "Schedule", icon: CalendarDays },
      { href: "/admin/facilities", label: "Facilities", icon: Building2 },
      { href: "/admin/transformations", label: "Transformations", icon: Sparkles },
      { href: "/admin/testimonials", label: "Testimonials", icon: Star },
      { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
      { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
      { href: "/admin/messages", label: "Contact Messages", icon: MessageSquare },
    ],
  },
  {
    label: "Website",
    items: [
      { href: "/admin/homepage", label: "Homepage Sections", icon: Layers },
      { href: "/admin/hero", label: "Hero", icon: Wand2 },
      { href: "/admin/about", label: "About & Stats", icon: Info },
      { href: "/admin/why-choose-us", label: "Why Choose Us", icon: MegaphoneIcon },
      { href: "/admin/cta", label: "Final CTA", icon: MegaphoneIcon },
      { href: "/admin/website/navigation", label: "Navigation & Social", icon: NavigationIcon },
      { href: "/admin/media", label: "Media Library", icon: ImageIcon },
    ],
  },
  {
    label: "Configuration",
    items: [
      { href: "/admin/branding", label: "Branding", icon: Palette, roles: ["SUPER_ADMIN", "ADMIN"] },
      { href: "/admin/theme", label: "Theme", icon: Palette, roles: ["SUPER_ADMIN", "ADMIN"] },
      { href: "/admin/seo", label: "SEO", icon: Search, roles: ["SUPER_ADMIN", "ADMIN"] },
      { href: "/admin/settings", label: "Settings", icon: Settings, roles: ["SUPER_ADMIN", "ADMIN"] },
      { href: "/admin/users", label: "Users", icon: ShieldCheck, roles: ["SUPER_ADMIN"] },
      { href: "/admin/activity", label: "Activity Log", icon: History },
    ],
  },
];

const COLLAPSE_STORAGE_KEY = "admin-sidebar-collapsed";

export function AdminSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // localStorage isn't readable during SSR, so this can't be a lazy
    // useState initializer without desyncing from the server-rendered
    // markup — read it once here instead, right after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (localStorage.getItem(COLLAPSE_STORAGE_KEY) === "1") setCollapsed(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <div className="relative hidden shrink-0 lg:block">
      <aside
        className={cn(
          "flex h-full flex-col border-r border-white/10 bg-[#080808] transition-[width] duration-200 ease-out",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div
          className={cn(
            "flex h-16 shrink-0 items-center gap-2 border-b border-white/10",
            collapsed ? "justify-center px-2" : "px-6"
          )}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-black">
            <Dumbbell className="h-4 w-4" strokeWidth={2.5} />
          </span>
          {!collapsed && <span className="heading-font text-sm tracking-wide">APEX ADMIN</span>}
        </div>
        <nav className={cn("flex-1 space-y-6 overflow-y-auto py-6", collapsed ? "px-2" : "px-3")}>
          {NAV_GROUPS.map((group) => {
            const items = group.items.filter((item) => !item.roles || item.roles.includes(role));
            if (items.length === 0) return null;
            return (
              <div key={group.label}>
                {!collapsed && (
                  <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/35">
                    {group.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const isActive =
                      item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          "group relative flex items-center gap-2.5 rounded-lg py-2 text-sm transition-all duration-150",
                          collapsed ? "justify-center px-2" : "px-3",
                          isActive
                            ? "bg-brand/15 text-brand"
                            : "text-foreground/60 hover:bg-white/5 hover:text-foreground",
                          !collapsed && !isActive && "hover:translate-x-0.5"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-brand transition-opacity duration-150",
                            isActive ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <Icon className="h-4 w-4 shrink-0" />
                        {!collapsed && item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      <button
        type="button"
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-6 z-40 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#080808] text-foreground/60 shadow-sm transition-colors hover:text-foreground"
      >
        {collapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
