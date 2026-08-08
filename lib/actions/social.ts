"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, MANAGE_SETTINGS_ROLES } from "@/lib/auth/guards";
import { logActivity } from "@/lib/actions/activity";
import type { ActionResult } from "@/lib/actions/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const socialSchema = z.object({
  platform: z.enum(["INSTAGRAM", "FACEBOOK", "TWITTER", "YOUTUBE", "TIKTOK", "LINKEDIN", "WHATSAPP"]),
  url: z.string().url(),
  order: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

function readForm(formData: FormData) {
  return socialSchema.safeParse({
    platform: formData.get("platform"),
    url: formData.get("url"),
    order: formData.get("order"),
    isActive: formData.get("isActive") === "true",
  });
}

export async function createSocialLink(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(MANAGE_SETTINGS_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const item = await prisma.socialLink.create({ data: parsed.data });
  await logActivity({ userId: session.id, action: "CREATE", entityType: "SocialLink", entityId: item.id, description: `${session.name} added a social link` });
  revalidatePath("/", "layout");
  revalidatePath("/admin/website/navigation");
  return { success: true };
}

export async function updateSocialLink(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(MANAGE_SETTINGS_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const item = await prisma.socialLink.update({ where: { id }, data: parsed.data });
  await logActivity({ userId: session.id, action: "UPDATE", entityType: "SocialLink", entityId: item.id, description: `${session.name} updated a social link` });
  revalidatePath("/", "layout");
  revalidatePath("/admin/website/navigation");
  return { success: true };
}

export async function deleteSocialLink(id: string) {
  const session = await requireRole(MANAGE_SETTINGS_ROLES);
  await prisma.socialLink.delete({ where: { id } });
  await logActivity({ userId: session.id, action: "DELETE", entityType: "SocialLink", description: `${session.name} removed a social link` });
  revalidatePath("/", "layout");
  revalidatePath("/admin/website/navigation");
}
