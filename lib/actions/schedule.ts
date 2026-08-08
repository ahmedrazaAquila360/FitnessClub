"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, ALL_ROLES } from "@/lib/auth/guards";
import { logActivity } from "@/lib/actions/activity";
import { classScheduleSchema } from "@/lib/validations/content";
import type { ActionResult } from "@/lib/actions/types";
import { revalidatePath } from "next/cache";

function readForm(formData: FormData) {
  return classScheduleSchema.safeParse({
    className: formData.get("className"),
    programId: formData.get("programId") || null,
    trainerId: formData.get("trainerId"),
    dayOfWeek: formData.get("dayOfWeek"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    room: formData.get("room"),
    difficulty: formData.get("difficulty"),
    capacity: formData.get("capacity"),
    booked: formData.get("booked"),
    isActive: formData.get("isActive") === "true",
  });
}

export async function createClass(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const item = await prisma.classSchedule.create({ data: parsed.data });
  await logActivity({ userId: session.id, action: "CREATE", entityType: "ClassSchedule", entityId: item.id, description: `${session.name} scheduled class "${item.className}"` });
  revalidatePath("/");
  revalidatePath("/schedule");
  revalidatePath("/admin/schedule");
  return { success: true };
}

export async function updateClass(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const item = await prisma.classSchedule.update({ where: { id }, data: parsed.data });
  await logActivity({ userId: session.id, action: "UPDATE", entityType: "ClassSchedule", entityId: item.id, description: `${session.name} updated class "${item.className}"` });
  revalidatePath("/");
  revalidatePath("/schedule");
  revalidatePath("/admin/schedule");
  return { success: true };
}

export async function deleteClass(id: string) {
  const session = await requireRole(ALL_ROLES);
  const item = await prisma.classSchedule.delete({ where: { id } });
  await logActivity({ userId: session.id, action: "DELETE", entityType: "ClassSchedule", entityId: id, description: `${session.name} removed class "${item.className}"` });
  revalidatePath("/");
  revalidatePath("/schedule");
  revalidatePath("/admin/schedule");
}

export async function toggleClassActive(id: string, isActive: boolean) {
  const session = await requireRole(ALL_ROLES);
  const item = await prisma.classSchedule.update({ where: { id }, data: { isActive } });
  await logActivity({ userId: session.id, action: isActive ? "ACTIVATE" : "DEACTIVATE", entityType: "ClassSchedule", entityId: id, description: `${session.name} ${isActive ? "activated" : "deactivated"} class "${item.className}"` });
  revalidatePath("/");
  revalidatePath("/admin/schedule");
}
