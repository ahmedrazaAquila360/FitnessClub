"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, ALL_ROLES } from "@/lib/auth/guards";
import { logActivity } from "@/lib/actions/activity";
import { facilitySchema } from "@/lib/validations/content";
import type { ActionResult } from "@/lib/actions/types";
import { revalidatePath } from "next/cache";

function readForm(formData: FormData) {
  return facilitySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    image: formData.get("image"),
    icon: formData.get("icon"),
    isFeatured: formData.get("isFeatured") === "true",
    order: formData.get("order"),
    isActive: formData.get("isActive") === "true",
  });
}

export async function createFacility(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const item = await prisma.facility.create({ data: parsed.data });
  await logActivity({ userId: session.id, action: "CREATE", entityType: "Facility", entityId: item.id, description: `${session.name} added facility "${item.name}"` });
  revalidatePath("/");
  revalidatePath("/admin/facilities");
  return { success: true };
}

export async function updateFacility(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const item = await prisma.facility.update({ where: { id }, data: parsed.data });
  await logActivity({ userId: session.id, action: "UPDATE", entityType: "Facility", entityId: item.id, description: `${session.name} updated facility "${item.name}"` });
  revalidatePath("/");
  revalidatePath("/admin/facilities");
  return { success: true };
}

export async function deleteFacility(id: string) {
  const session = await requireRole(ALL_ROLES);
  const item = await prisma.facility.delete({ where: { id } });
  await logActivity({ userId: session.id, action: "DELETE", entityType: "Facility", entityId: id, description: `${session.name} removed facility "${item.name}"` });
  revalidatePath("/");
  revalidatePath("/admin/facilities");
}

export async function toggleFacilityActive(id: string, isActive: boolean) {
  const session = await requireRole(ALL_ROLES);
  const item = await prisma.facility.update({ where: { id }, data: { isActive } });
  await logActivity({ userId: session.id, action: isActive ? "ACTIVATE" : "DEACTIVATE", entityType: "Facility", entityId: id, description: `${session.name} ${isActive ? "activated" : "deactivated"} facility "${item.name}"` });
  revalidatePath("/");
  revalidatePath("/admin/facilities");
}
