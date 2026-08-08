"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, ALL_ROLES } from "@/lib/auth/guards";
import { logActivity } from "@/lib/actions/activity";
import { membershipPlanSchema } from "@/lib/validations/content";
import type { ActionResult } from "@/lib/actions/types";
import { revalidatePath } from "next/cache";
import { parseListField } from "@/lib/utils";

function readForm(formData: FormData) {
  return membershipPlanSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    billingPeriod: formData.get("billingPeriod"),
    description: formData.get("description"),
    features: parseListField(formData, "features"),
    ctaLabel: formData.get("ctaLabel"),
    ctaHref: formData.get("ctaHref"),
    badge: formData.get("badge") || null,
    isFeatured: formData.get("isFeatured") === "true",
    order: formData.get("order"),
    isActive: formData.get("isActive") === "true",
  });
}

export async function createMembershipPlan(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const plan = await prisma.membershipPlan.create({ data: parsed.data });
  await logActivity({
    userId: session.id,
    action: "CREATE",
    entityType: "MembershipPlan",
    entityId: plan.id,
    description: `${session.name} created membership plan "${plan.name}"`,
  });
  revalidatePath("/");
  revalidatePath("/membership");
  revalidatePath("/admin/memberships");
  return { success: true };
}

export async function updateMembershipPlan(
  id: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireRole(ALL_ROLES);
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const plan = await prisma.membershipPlan.update({ where: { id }, data: parsed.data });
  await logActivity({
    userId: session.id,
    action: "UPDATE",
    entityType: "MembershipPlan",
    entityId: plan.id,
    description: `${session.name} updated membership plan "${plan.name}"`,
  });
  revalidatePath("/");
  revalidatePath("/membership");
  revalidatePath("/admin/memberships");
  return { success: true };
}

export async function deleteMembershipPlan(id: string) {
  const session = await requireRole(ALL_ROLES);
  const plan = await prisma.membershipPlan.delete({ where: { id } });
  await logActivity({
    userId: session.id,
    action: "DELETE",
    entityType: "MembershipPlan",
    entityId: id,
    description: `${session.name} deleted membership plan "${plan.name}"`,
  });
  revalidatePath("/");
  revalidatePath("/membership");
  revalidatePath("/admin/memberships");
}

export async function duplicateMembershipPlan(id: string) {
  const session = await requireRole(ALL_ROLES);
  const original = await prisma.membershipPlan.findUniqueOrThrow({ where: { id } });
  const copy = await prisma.membershipPlan.create({
    data: {
      ...original,
      id: undefined,
      name: `${original.name} (Copy)`,
      createdAt: undefined,
      updatedAt: undefined,
    },
  });
  await logActivity({
    userId: session.id,
    action: "DUPLICATE",
    entityType: "MembershipPlan",
    entityId: copy.id,
    description: `${session.name} duplicated membership plan "${original.name}"`,
  });
  revalidatePath("/");
  revalidatePath("/admin/memberships");
}

export async function toggleMembershipPlanActive(id: string, isActive: boolean) {
  const session = await requireRole(ALL_ROLES);
  const plan = await prisma.membershipPlan.update({ where: { id }, data: { isActive } });
  await logActivity({
    userId: session.id,
    action: isActive ? "ACTIVATE" : "DEACTIVATE",
    entityType: "MembershipPlan",
    entityId: id,
    description: `${session.name} ${isActive ? "activated" : "deactivated"} membership plan "${plan.name}"`,
  });
  revalidatePath("/");
  revalidatePath("/admin/memberships");
}
