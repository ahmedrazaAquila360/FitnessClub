"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, LogOut, ExternalLink } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ROLE_LABELS } from "@/lib/constants";
import { AdminMobileNav } from "@/components/admin/mobile-nav";
import type { Role } from "@prisma/client";

export function AdminTopbar({ name, role }: { name: string; role: Role }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-background/80 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 border-white/10 bg-[#080808] p-0">
            <SheetTitle className="sr-only">Admin navigation</SheetTitle>
            <AdminMobileNav role={role} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <Link
          href="/"
          target="_blank"
          className="hidden items-center gap-1.5 text-sm text-foreground/60 hover:text-brand sm:flex"
        >
          View site <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium leading-tight">{name}</p>
          <p className="text-xs leading-tight text-foreground/45">{ROLE_LABELS[role]}</p>
        </div>
        <form action={logoutAction}>
          <Button variant="ghost" size="icon" type="submit" aria-label="Log out">
            <LogOut className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
