"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, ALL_ROLES } from "@/lib/auth/guards";
import { contactMessageSchema } from "@/lib/validations/content";
import type { ActionResult } from "@/lib/actions/types";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/actions/activity";

export async function submitContactMessage(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = contactMessageSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  // Honeypot field — bots fill hidden inputs, humans never see them.
  if (formData.get("company")) {
    return { success: true };
  }

  await prisma.contactMessage.create({ data: parsed.data });
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function markMessageRead(id: string, isRead: boolean) {
  await requireRole(ALL_ROLES);
  await prisma.contactMessage.update({ where: { id }, data: { isRead } });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  const session = await requireRole(ALL_ROLES);
  await prisma.contactMessage.delete({ where: { id } });
  await logActivity({ userId: session.id, action: "DELETE", entityType: "ContactMessage", entityId: id, description: `${session.name} deleted a contact message` });
  revalidatePath("/admin/messages");
}
