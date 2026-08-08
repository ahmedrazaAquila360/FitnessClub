"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, ALL_ROLES } from "@/lib/auth/guards";
import { logActivity } from "@/lib/actions/activity";
import { testimonialSchema } from "@/lib/validations/content";
import type { ActionResult } from "@/lib/actions/types";
import { revalidatePath } from "next/cache";

function readForm(formData: FormData) {
  return testimonialSchema.safeParse({
    name: formData.get("name"),
    image: formData.get("image") || null,
    rating: formData.get("rating"),
    content: formData.get("content"),
    membership: formData.get("membership"),
    isFeatured: formData.get("isFeatured") === "true",
    order: formData.get("order"),
    isActive: formData.get("isActive") === "true",
  });
}

export async function createTestimonial(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const item = await prisma.testimonial.create({ data: parsed.data });
  await logActivity({ userId: session.id, action: "CREATE", entityType: "Testimonial", entityId: item.id, description: `${session.name} added testimonial from "${item.name}"` });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  return { success: true };
}

export async function updateTestimonial(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const item = await prisma.testimonial.update({ where: { id }, data: parsed.data });
  await logActivity({ userId: session.id, action: "UPDATE", entityType: "Testimonial", entityId: item.id, description: `${session.name} updated testimonial from "${item.name}"` });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const session = await requireRole(ALL_ROLES);
  const item = await prisma.testimonial.delete({ where: { id } });
  await logActivity({ userId: session.id, action: "DELETE", entityType: "Testimonial", entityId: id, description: `${session.name} removed testimonial from "${item.name}"` });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function toggleTestimonialActive(id: string, isActive: boolean) {
  const session = await requireRole(ALL_ROLES);
  const item = await prisma.testimonial.update({ where: { id }, data: { isActive } });
  await logActivity({ userId: session.id, action: isActive ? "ACTIVATE" : "DEACTIVATE", entityType: "Testimonial", entityId: id, description: `${session.name} ${isActive ? "activated" : "deactivated"} testimonial from "${item.name}"` });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}
