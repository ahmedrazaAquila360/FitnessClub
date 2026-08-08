"use client";

import Link from "next/link";
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

export function AdminSidebar({ role }: { role: Role }) {
  const pathname = usePathname();

  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-white/10 bg-[#080808] lg:flex">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-black">
          <Dumbbell className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <span className="heading-font text-sm tracking-wide">APEX ADMIN</span>
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
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-brand/15 text-brand"
                          : "text-foreground/60 hover:bg-white/5 hover:text-foreground"
                      )}
                    >
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
    </aside>
  );
}
