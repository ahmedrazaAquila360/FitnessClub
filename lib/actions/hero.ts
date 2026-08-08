"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, MANAGE_SETTINGS_ROLES } from "@/lib/auth/guards";
import { logActivity } from "@/lib/actions/activity";
import type { ActionResult } from "@/lib/actions/types";
import { revalidatePath } from "next/cache";
import { SINGLETON_ID } from "@/lib/constants";
import { requiredImageUrl } from "@/lib/validations/shared";
import { z } from "zod";

const heroSchema = z.object({
  badge: z.string().min(1),
  heading: z.string().min(1),
  headingHighlight: z.string().min(1),
  subtitle: z.string().optional().nullable(),
  description: z.string().min(1),
  primaryCtaLabel: z.string().min(1),
  primaryCtaHref: z.string().min(1),
  secondaryCtaLabel: z.string().min(1),
  secondaryCtaHref: z.string().min(1),
  backgroundImage: requiredImageUrl,
  backgroundVideo: z.string().url().optional().nullable().or(z.literal("")),
  overlayOpacity: z.coerce.number().min(0).max(1),
  textAlign: z.enum(["LEFT", "CENTER", "RIGHT"]),
  animationType: z.enum(["FADE_UP", "FADE_IN", "ZOOM_IN", "SLIDE_LEFT"]),
  isActive: z.coerce.boolean().default(true),
});

export async function updateHero(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(MANAGE_SETTINGS_ROLES);
  const parsed = heroSchema.safeParse({
    badge: formData.get("badge"),
    heading: formData.get("heading"),
    headingHighlight: formData.get("headingHighlight"),
    subtitle: formData.get("subtitle") || "",
    description: formData.get("description"),
    primaryCtaLabel: formData.get("primaryCtaLabel"),
    primaryCtaHref: formData.get("primaryCtaHref"),
    secondaryCtaLabel: formData.get("secondaryCtaLabel"),
    secondaryCtaHref: formData.get("secondaryCtaHref"),
    backgroundImage: formData.get("backgroundImage"),
    backgroundVideo: formData.get("backgroundVideo") || "",
    overlayOpacity: formData.get("overlayOpacity"),
    textAlign: formData.get("textAlign"),
    animationType: formData.get("animationType"),
    isActive: formData.get("isActive") === "true",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const data = { ...parsed.data, backgroundVideo: parsed.data.backgroundVideo || null };
  await prisma.heroSection.upsert({
    where: { id: SINGLETON_ID },
    create: { id: SINGLETON_ID, ...data },
    update: data,
  });
  await logActivity({ userId: session.id, action: "UPDATE", entityType: "HeroSection", entityId: SINGLETON_ID, description: `${session.name} updated the hero section` });
  revalidatePath("/");
  revalidatePath("/admin/hero");
  return { success: true };
}
