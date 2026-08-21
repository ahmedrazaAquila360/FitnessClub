# Collapsible Admin Sidebar Skill — Icon Rail + Scoped Light/Dark + Tooltips

A reusable implementation guide for a premium, collapsible dashboard sidebar:
icon-only collapsed rail, tooltips on hover, a themed scrollbar, and a
light/dark toggle scoped to just the dashboard subtree (without touching a
site that has its own fixed brand theme elsewhere). Built for Next.js App
Router + Tailwind v4 + shadcn/ui, but the underlying patterns (CSS-variable
theming, scoped class toggling, hydration-safe localStorage reads) port to
any React setup.

## 1. What this skill provides

- **Collapsible sidebar** — expanded (labels + icons) or collapsed (icon-only
  rail), not a full hide. Collapsing to `width: 0` throws away the nav
  entirely; collapsing to a narrow rail keeps it usable.
- **Tooltips on the rail** — when collapsed, hovering an icon shows its label
  via a `Tooltip` (shadcn/ui or any tooltip lib) instead of losing the label
  outright.
- **Themed scrollbar** — a thin, on-brand scrollbar for the sidebar's own
  scroll container, independent of the page's scrollbar.
- **Scoped light/dark mode** — a theme toggle that only affects one subtree
  (e.g. an admin dashboard) via a wrapper class, leaving the rest of the app
  (a marketing site with its own fixed brand palette) completely untouched.
- **Persistence** — collapsed state and theme choice both survive a reload,
  via `localStorage`, without causing a hydration mismatch.

## 2. Dependencies

```bash
npm install lucide-react
```

Tooltips: any shadcn/ui install already has `Tooltip`/`TooltipTrigger`/
`TooltipContent` (`npx shadcn@latest add tooltip`) and a `TooltipProvider`
wrapping the app root. If you're not on shadcn/ui, swap in whatever tooltip
primitive you have — the pattern (wrap the icon-only link when collapsed)
is what matters, not the specific library.

## 3. Nav data as config, not JSX

Keep the nav structure as typed data. This is what makes the sidebar
component itself generic — it never hardcodes a route list, so both the
desktop rail and a mobile off-canvas sheet can render from the same source.

```ts
// lib/nav.ts
import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Users, Settings2 /* ... */ } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  permission?: string; // omit if you don't need per-item RBAC
};

export type NavGroup = {
  label: string; // "" for an ungrouped top item like Dashboard
  icon?: LucideIcon;
  items: NavItem[];
};

export const NAV: NavGroup[] = [
  { label: "", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
  {
    label: "Settings",
    icon: Settings2,
    items: [
      { href: "/admin/users", label: "Users", icon: Users, permission: "users.view" },
      { href: "/admin/settings", label: "Site Settings", icon: Settings2 },
    ],
  },
];
```

Give every item a real icon up front. An icon-only collapsed rail with some
items missing icons looks broken — decide the icon at data-definition time,
not as an afterthought in the render layer.

## 4. The nav list component (`collapsed` as a prop, not two components)

Build **one** nav-list component that renders either mode based on a
`collapsed` boolean, reused by both the desktop shell and a mobile sheet.
Don't fork it into two components — you will inevitably let them drift.

```tsx
// components/nav-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function NavSidebar({
  permissions,
  collapsed = false,
}: {
  permissions: string[];
  collapsed?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6 text-sm">
      {NAV.map((group) => {
        const items = group.items.filter((i) => !i.permission || permissions.includes(i.permission));
        if (items.length === 0) return null;
        const GroupIcon = group.icon;

        return (
          <div key={group.label || "root"} className={cn(group.label && "border-t pt-6")}>
            {group.label && !collapsed && (
              <div className="mb-2 flex items-center gap-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                {GroupIcon && <GroupIcon className="size-3" strokeWidth={2.5} />}
                {group.label}
              </div>
            )}
            <div className={cn("flex flex-col gap-0.5", collapsed && "items-center")}>
              {items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;

                const link = (
                  <Link
                    href={item.href}
                    aria-label={collapsed ? item.label : undefined}
                    className={cn(
                      "group relative flex items-center gap-2.5 rounded-md transition-all duration-150",
                      collapsed ? "justify-center p-2" : "px-3 py-2",
                      active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {/* Active accent bar — absolutely positioned so it works identically collapsed or expanded. */}
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary transition-opacity",
                        active ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <Icon className={cn("size-4 shrink-0", active ? "text-primary" : "text-muted-foreground/70")} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );

                if (!collapsed) return <div key={item.href}>{link}</div>;

                return (
                  <Tooltip key={item.href} delayDuration={100}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
```

Key decisions baked into this component:

- The **active accent bar is `position: absolute`**, anchored to the link's
  own box — it renders identically whether the link is a full-width row or a
  centered icon square. No separate collapsed-mode styling needed for it.
- **Tooltip only wraps the link when collapsed.** Wrapping it unconditionally
  means every hover in expanded mode also fires a redundant tooltip next to
  a label that's already visible — annoying, not premium.
- **`aria-label` is added only when collapsed**, because that's the only
  state where the visible text disappears and screen readers need the
  fallback.

## 5. The collapsible shell (desktop)

This owns the collapse/expand state, the icon-rail width, and the toggle
button. Keep this separate from the nav-list component above — the shell is
about *layout*, the nav list is about *content*.

```tsx
// components/nav-shell.tsx
"use client";

import { useEffect, useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NavSidebar } from "@/components/nav-sidebar";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "sidebar-collapsed";

export function NavShell({ permissions }: { permissions: string[] }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // localStorage isn't readable during SSR — see section 7 on why this
    // can't be a lazy useState initializer instead.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (localStorage.getItem(STORAGE_KEY) === "1") setCollapsed(true);
  }, []);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <div className="relative hidden shrink-0 lg:block">
      <aside
        className={cn(
          "scrollbar-themed relative flex h-full flex-col overflow-x-hidden overflow-y-auto border-r transition-[width] duration-200 ease-out",
          collapsed ? "w-16 px-2 py-4" : "w-64 p-4"
        )}
      >
        <NavSidebar permissions={permissions} collapsed={collapsed} />
      </aside>

      <button
        type="button"
        onClick={toggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-6 z-10 flex size-6 items-center justify-center rounded-full border bg-card shadow-sm"
      >
        {collapsed ? <PanelLeftOpen className="size-3.5" /> : <PanelLeftClose className="size-3.5" />}
      </button>
    </div>
  );
}
```

**Why `w-16` (a real rail width) and not `w-0`:** collapsing to zero throws
the nav away entirely — the user loses navigation until they reopen it. A
64px icon rail keeps every destination one click away, which is the entire
point of a "collapse" affordance versus a "close" affordance. If you
genuinely want a full hide (e.g. a mobile drawer), that's a different
pattern — see section 8.

**Why the toggle button can stay at a fixed `-right-3` regardless of state:**
because the rail never hits zero width, `right: -12px` always resolves to a
real, on-screen position. (If you do collapse to zero elsewhere, you'll need
to flip the anchor to `left` in that state, or the button ends up half
off-screen.)

## 6. Themed scrollbar

A plain CSS utility class — no JS needed. Uses `color-mix()` so it always
tracks your theme's primary/accent color rather than a hardcoded hex.

```css
.scrollbar-themed {
  scrollbar-width: thin;
  scrollbar-color: color-mix(in oklch, var(--primary) 55%, transparent) transparent;
}
.scrollbar-themed::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-themed::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-themed::-webkit-scrollbar-thumb {
  background-color: var(--primary);
  opacity: 0.55;
  border-radius: 999px;
}
.scrollbar-themed:hover::-webkit-scrollbar-thumb {
  opacity: 0.9;
}
```

Apply the class to whatever element has `overflow-y: auto` — the `<aside>`
above, a mobile sheet's content container, anywhere with its own
independent scroll.

## 7. Scoped light/dark mode (the part that's easy to get wrong)

**The problem this solves:** most theme-toggle tutorials assume the *whole
site* should follow the toggle, so they put a `dark` class on `<html>`. That
breaks the moment you only want ONE section of the app (e.g. an admin
dashboard) to be toggleable, while the rest of the app (a marketing site
with a fixed brand palette) must never change regardless of what the user
picks in the dashboard. `next-themes` and similar libraries are built around
the single-root-class model and don't cleanly support "only this subtree."

**The fix:** scope the alternate palette to a CSS class that only wraps the
dashboard, using `display: contents` on the wrapper so it adds zero layout
box — it exists purely so CSS custom properties can cascade differently to
its descendants.

```css
/* globals.css — :root defines your default palette (used everywhere,
   including the parts of the app that should never re-theme). */
:root {
  --background: oklch(0.1 0.004 285);
  --foreground: oklch(0.96 0.012 85);
  --primary: oklch(0.74 0.11 80);
  --border: oklch(1 0 0 / 10%);
  /* ...every other token your components read... */
}

/* A second palette, scoped — only applies to descendants of an element
   carrying this class, never to :root itself. */
.theme-light {
  --background: oklch(0.985 0.004 85);
  --foreground: oklch(0.18 0.006 285);
  --primary: oklch(0.58 0.13 80);
  --border: oklch(0.18 0.006 285 / 10%);
  /* ...mirror every token from :root that your components actually use... */
}
```

```tsx
// components/theme-provider.tsx
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "theme";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (localStorage.getItem(STORAGE_KEY) === "light") setTheme("light");
  }, []);

  function toggle() {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div className={theme === "light" ? "theme-light contents" : "contents"}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
```

Wrap only the subtree you want toggleable:

```tsx
// app/admin/layout.tsx
<ThemeProvider>
  <div className="flex h-screen bg-background text-foreground">
    <NavShell permissions={permissions} />
    <main>{children}</main>
  </div>
</ThemeProvider>
```

Everything outside `<ThemeProvider>` — the rest of the app, `<html>` itself
— never sees a class change and never re-themes. This is the whole trick:
**scope the class to a wrapper div, not to `<html>`,** and let CSS custom
property inheritance do the rest.

## 8. Why every read of `localStorage`/`matchMedia` here uses "start with a
safe default, then correct after mount" instead of a lazy `useState` initializer

You'll notice both the collapse state and the theme state start as a fixed
default (`false` / `"dark"`) and only get corrected inside a `useEffect`
after mount, rather than reading `localStorage` directly in
`useState(() => ...)`. This is deliberate, not an oversight:

- `localStorage` doesn't exist during server-side rendering. A lazy
  initializer like `useState(() => localStorage.getItem(KEY) === "1")`
  would throw on the server.
- Even guarded with `typeof window !== "undefined"`, that guard only
  prevents a *crash* — it doesn't prevent a *mismatch*. The server always
  renders the `false` branch (no `window`), but the client's very first
  render (during hydration) already has a real `window` and would read the
  real stored value immediately — producing different markup between what
  the server sent and what React expects to find on the client, which React
  flags as a hydration error.
- Starting both server and the client's first render at the same safe
  default, then correcting the state in a `useEffect` (which only ever runs
  client-side, strictly after hydration completes), avoids the mismatch
  entirely. The cost is a one-frame flash back to the default on repeat
  visits — acceptable for a sidebar's collapsed/theme state, not acceptable
  for something like a hero video where FOUC matters more (that's a
  different tradeoff for a different problem).

If your linter has a `react-hooks/set-state-in-effect` rule, it will flag
the `setCollapsed`/`setTheme` calls inside these effects — that's the linter
correctly recognizing a `setState`-in-effect pattern, but this is one of the
legitimate exceptions the rule doesn't have context for (syncing from an
external store on mount). Suppress it locally with a comment explaining why,
rather than restructuring around a lazy initializer that would just
reintroduce the hydration bug.

## 9. Mobile companion

Reuse the same `NavSidebar` inside an off-canvas sheet — this is the one
place a *full hide/show* (not a rail) is correct, since on mobile the nav
should either be completely out of the way or completely open.

```tsx
// components/nav-mobile.tsx
"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavSidebar } from "@/components/nav-sidebar";

export function NavMobile({ permissions }: { permissions: string[] }) {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden">
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="scrollbar-themed w-72 overflow-y-auto p-4">
        <NavSidebar permissions={permissions} />
      </SheetContent>
    </Sheet>
  );
}
```

Note `collapsed` is simply omitted here — it defaults to `false`, so the
sheet always shows full labels. There's no icon-rail mode on mobile; a
narrow rail makes no sense when the nav is already an overlay the user
opened on purpose.

## 10. Assembly checklist for a new project

1. Define your `NAV` config with real icons per item (section 3).
2. Build `NavSidebar` taking a `collapsed` prop (section 4).
3. Build `NavShell` for desktop, owning collapse state + the toggle button
   (section 5).
4. Add `.scrollbar-themed` to `globals.css` (section 6).
5. If you need a toggleable theme scoped to one section only, add the
   `.theme-light` (or equivalently-named) palette block and `ThemeProvider`
   (section 7) — skip this entirely if the whole app should just follow
   `prefers-color-scheme` or a single global toggle; that's a simpler,
   different problem.
6. Build `NavMobile` reusing `NavSidebar` with `collapsed` omitted
   (section 9).
7. Wire `NavShell` + `NavMobile` into your dashboard layout, both fed the
   same `permissions` (or just drop the permission filtering if you don't
   need per-item RBAC).

## 11. Verification checklist

Before calling this done in a new project:

- Collapse the sidebar with a real click (not just visually) — confirm the
  rest of the content reflows to use the freed width.
- Hover every icon in the collapsed rail — confirm a tooltip shows the
  correct label, positioned so it doesn't clip off-screen.
- Reload the page after collapsing — state should persist, with no
  hydration warning in the console.
- If you added the scoped theme toggle: toggle it, reload, confirm it
  persists — then check a page *outside* the toggled subtree and confirm
  it's completely unaffected.
- Resize below your mobile breakpoint — confirm the desktop rail disappears
  and the mobile sheet trigger takes over cleanly, with no double-rendered
  nav.
