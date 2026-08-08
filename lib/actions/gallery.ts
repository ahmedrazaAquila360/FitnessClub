"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, ALL_ROLES } from "@/lib/auth/guards";
import { logActivity } from "@/lib/actions/activity";
import { galleryItemSchema } from "@/lib/validations/content";
import type { ActionResult } from "@/lib/actions/types";
import { revalidatePath } from "next/cache";

function readForm(formData: FormData) {
  return galleryItemSchema.safeParse({
    image: formData.get("image"),
    category: formData.get("category"),
    caption: formData.get("caption") || null,
    altText: formData.get("altText") || "",
    isFeatured: formData.get("isFeatured") === "true",
    order: formData.get("order"),
    isActive: formData.get("isActive") === "true",
  });
}

export async function createGalleryItem(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const item = await prisma.galleryItem.create({ data: parsed.data });
  await logActivity({ userId: session.id, action: "CREATE", entityType: "GalleryItem", entityId: item.id, description: `${session.name} uploaded a gallery image` });
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  return { success: true };
}

export async function updateGalleryItem(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const item = await prisma.galleryItem.update({ where: { id }, data: parsed.data });
  await logActivity({ userId: session.id, action: "UPDATE", entityType: "GalleryItem", entityId: item.id, description: `${session.name} updated a gallery image` });
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  return { success: true };
}

export async function deleteGalleryItem(id: string) {
  const session = await requireRole(ALL_ROLES);
  await prisma.galleryItem.delete({ where: { id } });
  await logActivity({ userId: session.id, action: "DELETE", entityType: "GalleryItem", entityId: id, description: `${session.name} removed a gallery image` });
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function toggleGalleryItemActive(id: string, isActive: boolean) {
  const session = await requireRole(ALL_ROLES);
  await prisma.galleryItem.update({ where: { id }, data: { isActive } });
  await logActivity({ userId: session.id, action: isActive ? "ACTIVATE" : "DEACTIVATE", entityType: "GalleryItem", entityId: id, description: `${session.name} ${isActive ? "activated" : "deactivated"} a gallery image` });
  revalidatePath("/");
  revalidatePath("/admin/gallery");
}
