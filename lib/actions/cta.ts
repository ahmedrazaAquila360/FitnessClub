"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, MANAGE_SETTINGS_ROLES } from "@/lib/auth/guards";
import { logActivity } from "@/lib/actions/activity";
import type { ActionResult } from "@/lib/actions/types";
import { revalidatePath } from "next/cache";
import { SINGLETON_ID } from "@/lib/constants";
import { requiredImageUrl } from "@/lib/validations/shared";
import { z } from "zod";

const ctaSchema = z.object({
  heading: z.string().min(1),
  headingHighlight: z.string().min(1),
  description: z.string().min(1),
  primaryCtaLabel: z.string().min(1),
  primaryCtaHref: z.string().min(1),
  secondaryCtaLabel: z.string().min(1),
  secondaryCtaHref: z.string().min(1),
  backgroundImage: requiredImageUrl,
  isActive: z.coerce.boolean().default(true),
});

export async function updateCTA(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(MANAGE_SETTINGS_ROLES);
  const parsed = ctaSchema.safeParse({
    heading: formData.get("heading"),
    headingHighlight: formData.get("headingHighlight"),
    description: formData.get("description"),
    primaryCtaLabel: formData.get("primaryCtaLabel"),
    primaryCtaHref: formData.get("primaryCtaHref"),
    secondaryCtaLabel: formData.get("secondaryCtaLabel"),
    secondaryCtaHref: formData.get("secondaryCtaHref"),
    backgroundImage: formData.get("backgroundImage"),
    isActive: formData.get("isActive") === "true",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  await prisma.cTASection.upsert({
    where: { id: SINGLETON_ID },
    create: { id: SINGLETON_ID, ...parsed.data },
    update: parsed.data,
  });
  await logActivity({ userId: session.id, action: "UPDATE", entityType: "CTASection", entityId: SINGLETON_ID, description: `${session.name} updated the final CTA section` });
  revalidatePath("/");
  revalidatePath("/admin/cta");
  return { success: true };
}
