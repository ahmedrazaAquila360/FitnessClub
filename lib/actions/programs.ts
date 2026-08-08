"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, ALL_ROLES } from "@/lib/auth/guards";
import { logActivity } from "@/lib/actions/activity";
import { programSchema } from "@/lib/validations/content";
import type { ActionResult } from "@/lib/actions/types";
import { revalidatePath } from "next/cache";

function readProgramForm(formData: FormData) {
  return programSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    shortDescription: formData.get("shortDescription"),
    image: formData.get("image"),
    icon: formData.get("icon"),
    category: formData.get("category"),
    duration: formData.get("duration"),
    difficulty: formData.get("difficulty"),
    trainerId: formData.get("trainerId") || null,
    ctaLabel: formData.get("ctaLabel"),
    ctaHref: formData.get("ctaHref") || null,
    isFeatured: formData.get("isFeatured") === "true",
    order: formData.get("order"),
    isActive: formData.get("isActive") === "true",
  });
}

export async function createProgram(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readProgramForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }
  try {
    const program = await prisma.program.create({ data: parsed.data });
    await logActivity({
      userId: session.id,
      action: "CREATE",
      entityType: "Program",
      entityId: program.id,
      description: `${session.name} created program "${program.name}"`,
    });
  } catch (e) {
    return { error: e instanceof Error && e.message.includes("Unique") ? "That slug is already in use." : "Failed to create program." };
  }
  revalidatePath("/");
  revalidatePath("/programs");
  revalidatePath("/admin/programs");
  return { success: true };
}

export async function updateProgram(
  id: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readProgramForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }
  try {
    const program = await prisma.program.update({
      where: { id },
      data: parsed.data,
    });
    await logActivity({
      userId: session.id,
      action: "UPDATE",
      entityType: "Program",
      entityId: program.id,
      description: `${session.name} updated program "${program.name}"`,
    });
  } catch {
    return { error: "Failed to update program." };
  }
  revalidatePath("/");
  revalidatePath("/programs");
  revalidatePath("/admin/programs");
  return { success: true };
}

export async function deleteProgram(id: string) {
  const session = await requireRole(ALL_ROLES);
  const program = await prisma.program.delete({ where: { id } });
  await logActivity({
    userId: session.id,
    action: "DELETE",
    entityType: "Program",
    entityId: id,
    description: `${session.name} deleted program "${program.name}"`,
  });
  revalidatePath("/");
  revalidatePath("/programs");
  revalidatePath("/admin/programs");
}

export async function duplicateProgram(id: string) {
  const session = await requireRole(ALL_ROLES);
  const original = await prisma.program.findUniqueOrThrow({ where: { id } });
  const copy = await prisma.program.create({
    data: {
      ...original,
      id: undefined,
      name: `${original.name} (Copy)`,
      slug: `${original.slug}-copy-${Date.now().toString(36)}`,
      createdAt: undefined,
      updatedAt: undefined,
    },
  });
  await logActivity({
    userId: session.id,
    action: "DUPLICATE",
    entityType: "Program",
    entityId: copy.id,
    description: `${session.name} duplicated program "${original.name}"`,
  });
  revalidatePath("/");
  revalidatePath("/admin/programs");
}

export async function toggleProgramActive(id: string, isActive: boolean) {
  const session = await requireRole(ALL_ROLES);
  const program = await prisma.program.update({
    where: { id },
    data: { isActive },
  });
  await logActivity({
    userId: session.id,
    action: isActive ? "ACTIVATE" : "DEACTIVATE",
    entityType: "Program",
    entityId: id,
    description: `${session.name} ${isActive ? "activated" : "deactivated"} program "${program.name}"`,
  });
  revalidatePath("/");
  revalidatePath("/admin/programs");
}
