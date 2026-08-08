"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, ALL_ROLES } from "@/lib/auth/guards";
import { logActivity } from "@/lib/actions/activity";
import { transformationSchema } from "@/lib/validations/content";
import type { ActionResult } from "@/lib/actions/types";
import { revalidatePath } from "next/cache";

function readForm(formData: FormData) {
  return transformationSchema.safeParse({
    memberName: formData.get("memberName"),
    beforeImage: formData.get("beforeImage"),
    afterImage: formData.get("afterImage"),
    duration: formData.get("duration"),
    goal: formData.get("goal"),
    story: formData.get("story"),
    result: formData.get("result"),
    isFeatured: formData.get("isFeatured") === "true",
    order: formData.get("order"),
    isActive: formData.get("isActive") === "true",
  });
}

export async function createTransformation(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const item = await prisma.transformation.create({ data: parsed.data });
  await logActivity({ userId: session.id, action: "CREATE", entityType: "Transformation", entityId: item.id, description: `${session.name} added transformation story for "${item.memberName}"` });
  revalidatePath("/");
  revalidatePath("/admin/transformations");
  return { success: true };
}

export async function updateTransformation(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const item = await prisma.transformation.update({ where: { id }, data: parsed.data });
  await logActivity({ userId: session.id, action: "UPDATE", entityType: "Transformation", entityId: item.id, description: `${session.name} updated transformation story for "${item.memberName}"` });
  revalidatePath("/");
  revalidatePath("/admin/transformations");
  return { success: true };
}

export async function deleteTransformation(id: string) {
  const session = await requireRole(ALL_ROLES);
  const item = await prisma.transformation.delete({ where: { id } });
  await logActivity({ userId: session.id, action: "DELETE", entityType: "Transformation", entityId: id, description: `${session.name} removed transformation story for "${item.memberName}"` });
  revalidatePath("/");
  revalidatePath("/admin/transformations");
}

export async function toggleTransformationActive(id: string, isActive: boolean) {
  const session = await requireRole(ALL_ROLES);
  const item = await prisma.transformation.update({ where: { id }, data: { isActive } });
  await logActivity({ userId: session.id, action: isActive ? "ACTIVATE" : "DEACTIVATE", entityType: "Transformation", entityId: id, description: `${session.name} ${isActive ? "activated" : "deactivated"} transformation "${item.memberName}"` });
  revalidatePath("/");
  revalidatePath("/admin/transformations");
}
