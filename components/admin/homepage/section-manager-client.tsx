"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { PageSection } from "@prisma/client";

// dnd-kit generates its accessibility ids via an internal counter that is not
// guaranteed to match between the server render and the client hydration pass,
// so this widget is rendered client-only to avoid a hydration mismatch.
const SectionManager = dynamic(
  () => import("@/components/admin/homepage/section-manager").then((m) => m.SectionManager),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[60px] w-full rounded-xl" />
        ))}
      </div>
    ),
  }
);

export function SectionManagerClient({ sections }: { sections: PageSection[] }) {
  return <SectionManager sections={sections} />;
}
