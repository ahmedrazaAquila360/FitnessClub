"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, MANAGE_SETTINGS_ROLES } from "@/lib/auth/guards";
import { logActivity } from "@/lib/actions/activity";
import { revalidatePath } from "next/cache";

export async function toggleSectionEnabled(id: string, isEnabled: boolean) {
  const session = await requireRole(MANAGE_SETTINGS_ROLES);
  const section = await prisma.pageSection.update({ where: { id }, data: { isEnabled } });
  await logActivity({
    userId: session.id,
    action: isEnabled ? "ENABLE" : "DISABLE",
    entityType: "PageSection",
    entityId: id,
    description: `${session.name} ${isEnabled ? "enabled" : "disabled"} the "${section.name}" section`,
  });
  revalidatePath("/");
  revalidatePath("/admin/homepage");
}

export async function reorderSections(orderedIds: string[]) {
  const session = await requireRole(MANAGE_SETTINGS_ROLES);
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.pageSection.update({ where: { id }, data: { order: index } })
    )
  );
  await logActivity({
    userId: session.id,
    action: "REORDER",
    entityType: "PageSection",
    description: `${session.name} reordered homepage sections`,
  });
  revalidatePath("/");
  revalidatePath("/admin/homepage");
}
