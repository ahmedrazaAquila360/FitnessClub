"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, MANAGE_SETTINGS_ROLES } from "@/lib/auth/guards";
import { logActivity } from "@/lib/actions/activity";
import type { ActionResult } from "@/lib/actions/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const navSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  location: z.enum(["HEADER", "FOOTER"]),
  order: z.coerce.number().int().default(0),
  isExternal: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
});

function readForm(formData: FormData) {
  return navSchema.safeParse({
    label: formData.get("label"),
    href: formData.get("href"),
    location: formData.get("location"),
    order: formData.get("order"),
    isExternal: formData.get("isExternal") === "true",
    isActive: formData.get("isActive") === "true",
  });
}

export async function createNavItem(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(MANAGE_SETTINGS_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const item = await prisma.navigationItem.create({ data: parsed.data });
  await logActivity({ userId: session.id, action: "CREATE", entityType: "NavigationItem", entityId: item.id, description: `${session.name} added nav item "${item.label}"` });
  revalidatePath("/", "layout");
  revalidatePath("/admin/website/navigation");
  return { success: true };
}

export async function updateNavItem(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(MANAGE_SETTINGS_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const item = await prisma.navigationItem.update({ where: { id }, data: parsed.data });
  await logActivity({ userId: session.id, action: "UPDATE", entityType: "NavigationItem", entityId: item.id, description: `${session.name} updated nav item "${item.label}"` });
  revalidatePath("/", "layout");
  revalidatePath("/admin/website/navigation");
  return { success: true };
}

export async function deleteNavItem(id: string) {
  const session = await requireRole(MANAGE_SETTINGS_ROLES);
  const item = await prisma.navigationItem.delete({ where: { id } });
  await logActivity({ userId: session.id, action: "DELETE", entityType: "NavigationItem", entityId: id, description: `${session.name} removed nav item "${item.label}"` });
  revalidatePath("/", "layout");
  revalidatePath("/admin/website/navigation");
}

export async function reorderNavItems(orderedIds: string[]) {
  const session = await requireRole(MANAGE_SETTINGS_ROLES);
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.navigationItem.update({ where: { id }, data: { order: index } })
    )
  );
  await logActivity({ userId: session.id, action: "REORDER", entityType: "NavigationItem", description: `${session.name} reordered navigation` });
  revalidatePath("/", "layout");
  revalidatePath("/admin/website/navigation");
}
