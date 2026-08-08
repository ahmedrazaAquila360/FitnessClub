"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, ALL_ROLES } from "@/lib/auth/guards";
import { logActivity } from "@/lib/actions/activity";
import { faqSchema } from "@/lib/validations/content";
import type { ActionResult } from "@/lib/actions/types";
import { revalidatePath } from "next/cache";

function readForm(formData: FormData) {
  return faqSchema.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    category: formData.get("category") || "General",
    order: formData.get("order"),
    isActive: formData.get("isActive") === "true",
  });
}

export async function createFAQ(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const item = await prisma.fAQ.create({ data: parsed.data });
  await logActivity({ userId: session.id, action: "CREATE", entityType: "FAQ", entityId: item.id, description: `${session.name} added an FAQ` });
  revalidatePath("/");
  revalidatePath("/admin/faqs");
  return { success: true };
}

export async function updateFAQ(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const item = await prisma.fAQ.update({ where: { id }, data: parsed.data });
  await logActivity({ userId: session.id, action: "UPDATE", entityType: "FAQ", entityId: item.id, description: `${session.name} updated an FAQ` });
  revalidatePath("/");
  revalidatePath("/admin/faqs");
  return { success: true };
}

export async function deleteFAQ(id: string) {
  const session = await requireRole(ALL_ROLES);
  await prisma.fAQ.delete({ where: { id } });
  await logActivity({ userId: session.id, action: "DELETE", entityType: "FAQ", entityId: id, description: `${session.name} removed an FAQ` });
  revalidatePath("/");
  revalidatePath("/admin/faqs");
}

export async function toggleFAQActive(id: string, isActive: boolean) {
  const session = await requireRole(ALL_ROLES);
  await prisma.fAQ.update({ where: { id }, data: { isActive } });
  await logActivity({ userId: session.id, action: isActive ? "ACTIVATE" : "DEACTIVATE", entityType: "FAQ", entityId: id, description: `${session.name} toggled an FAQ` });
  revalidatePath("/");
  revalidatePath("/admin/faqs");
}
