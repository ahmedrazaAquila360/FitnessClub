"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, ALL_ROLES } from "@/lib/auth/guards";
import { logActivity } from "@/lib/actions/activity";
import { trainerSchema } from "@/lib/validations/content";
import type { ActionResult } from "@/lib/actions/types";
import { revalidatePath } from "next/cache";
import { parseListField } from "@/lib/utils";

function readForm(formData: FormData) {
  return trainerSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    image: formData.get("image"),
    position: formData.get("position"),
    specialization: parseListField(formData, "specialization"),
    bio: formData.get("bio"),
    experienceYears: formData.get("experienceYears"),
    certifications: parseListField(formData, "certifications"),
    instagram: formData.get("instagram") || null,
    facebook: formData.get("facebook") || null,
    twitter: formData.get("twitter") || null,
    youtube: formData.get("youtube") || null,
    isFeatured: formData.get("isFeatured") === "true",
    order: formData.get("order"),
    isActive: formData.get("isActive") === "true",
  });
}

export async function createTrainer(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  try {
    const trainer = await prisma.trainer.create({ data: parsed.data });
    await logActivity({ userId: session.id, action: "CREATE", entityType: "Trainer", entityId: trainer.id, description: `${session.name} added trainer "${trainer.name}"` });
  } catch {
    return { error: "That slug is already in use." };
  }
  revalidatePath("/");
  revalidatePath("/trainers");
  revalidatePath("/admin/trainers");
  return { success: true };
}

export async function updateTrainer(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const trainer = await prisma.trainer.update({ where: { id }, data: parsed.data });
  await logActivity({ userId: session.id, action: "UPDATE", entityType: "Trainer", entityId: trainer.id, description: `${session.name} updated trainer "${trainer.name}"` });
  revalidatePath("/");
  revalidatePath("/trainers");
  revalidatePath("/admin/trainers");
  return { success: true };
}

export async function deleteTrainer(id: string) {
  const session = await requireRole(ALL_ROLES);
  const trainer = await prisma.trainer.delete({ where: { id } });
  await logActivity({ userId: session.id, action: "DELETE", entityType: "Trainer", entityId: id, description: `${session.name} removed trainer "${trainer.name}"` });
  revalidatePath("/");
  revalidatePath("/trainers");
  revalidatePath("/admin/trainers");
}

export async function toggleTrainerActive(id: string, isActive: boolean) {
  const session = await requireRole(ALL_ROLES);
  const trainer = await prisma.trainer.update({ where: { id }, data: { isActive } });
  await logActivity({ userId: session.id, action: isActive ? "ACTIVATE" : "DEACTIVATE", entityType: "Trainer", entityId: id, description: `${session.name} ${isActive ? "activated" : "deactivated"} trainer "${trainer.name}"` });
  revalidatePath("/");
  revalidatePath("/admin/trainers");
}
