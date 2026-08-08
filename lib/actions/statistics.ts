"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, ALL_ROLES } from "@/lib/auth/guards";
import { logActivity } from "@/lib/actions/activity";
import { statisticSchema } from "@/lib/validations/content";
import type { ActionResult } from "@/lib/actions/types";
import { revalidatePath } from "next/cache";

function readForm(formData: FormData) {
  return statisticSchema.safeParse({
    label: formData.get("label"),
    value: formData.get("value"),
    suffix: formData.get("suffix") || "",
    icon: formData.get("icon") || "Users",
    order: formData.get("order"),
    isActive: formData.get("isActive") === "true",
  });
}

export async function createStatistic(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const item = await prisma.statistic.create({ data: parsed.data });
  await logActivity({ userId: session.id, action: "CREATE", entityType: "Statistic", entityId: item.id, description: `${session.name} added statistic "${item.label}"` });
  revalidatePath("/");
  revalidatePath("/admin/about");
  return { success: true };
}

export async function updateStatistic(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const item = await prisma.statistic.update({ where: { id }, data: parsed.data });
  await logActivity({ userId: session.id, action: "UPDATE", entityType: "Statistic", entityId: item.id, description: `${session.name} updated statistic "${item.label}"` });
  revalidatePath("/");
  revalidatePath("/admin/about");
  return { success: true };
}

export async function deleteStatistic(id: string) {
  const session = await requireRole(ALL_ROLES);
  const item = await prisma.statistic.delete({ where: { id } });
  await logActivity({ userId: session.id, action: "DELETE", entityType: "Statistic", entityId: id, description: `${session.name} removed statistic "${item.label}"` });
  revalidatePath("/");
  revalidatePath("/admin/about");
}
