"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, ALL_ROLES } from "@/lib/auth/guards";
import { logActivity } from "@/lib/actions/activity";
import { whyChooseUsSchema } from "@/lib/validations/content";
import type { ActionResult } from "@/lib/actions/types";
import { revalidatePath } from "next/cache";

function readForm(formData: FormData) {
  return whyChooseUsSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    icon: formData.get("icon"),
    image: formData.get("image") || null,
    order: formData.get("order"),
    isActive: formData.get("isActive") === "true",
  });
}

export async function createWhyChooseUsItem(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const item = await prisma.whyChooseUsItem.create({ data: parsed.data });
  await logActivity({ userId: session.id, action: "CREATE", entityType: "WhyChooseUsItem", entityId: item.id, description: `${session.name} added "${item.title}" to Why Choose Us` });
  revalidatePath("/");
  revalidatePath("/admin/why-choose-us");
  return { success: true };
}

export async function updateWhyChooseUsItem(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const item = await prisma.whyChooseUsItem.update({ where: { id }, data: parsed.data });
  await logActivity({ userId: session.id, action: "UPDATE", entityType: "WhyChooseUsItem", entityId: item.id, description: `${session.name} updated "${item.title}"` });
  revalidatePath("/");
  revalidatePath("/admin/why-choose-us");
  return { success: true };
}

export async function deleteWhyChooseUsItem(id: string) {
  const session = await requireRole(ALL_ROLES);
  const item = await prisma.whyChooseUsItem.delete({ where: { id } });
  await logActivity({ userId: session.id, action: "DELETE", entityType: "WhyChooseUsItem", entityId: id, description: `${session.name} removed "${item.title}"` });
  revalidatePath("/");
  revalidatePath("/admin/why-choose-us");
}

export async function toggleWhyChooseUsItemActive(id: string, isActive: boolean) {
  const session = await requireRole(ALL_ROLES);
  await prisma.whyChooseUsItem.update({ where: { id }, data: { isActive } });
  await logActivity({ userId: session.id, action: isActive ? "ACTIVATE" : "DEACTIVATE", entityType: "WhyChooseUsItem", entityId: id, description: `${session.name} toggled a Why Choose Us item` });
  revalidatePath("/");
  revalidatePath("/admin/why-choose-us");
}
