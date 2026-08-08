"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, MANAGE_SETTINGS_ROLES } from "@/lib/auth/guards";
import { logActivity } from "@/lib/actions/activity";
import type { ActionResult } from "@/lib/actions/types";
import { revalidatePath } from "next/cache";
import { SINGLETON_ID } from "@/lib/constants";
import { z } from "zod";

const gymSchema = z.object({
  brandName: z.string().min(1),
  tagline: z.string().min(1),
  logoUrl: z.string().url().optional().nullable().or(z.literal("")),
  logoDarkUrl: z.string().url().optional().nullable().or(z.literal("")),
  logoLightUrl: z.string().url().optional().nullable().or(z.literal("")),
  faviconUrl: z.string().url().optional().nullable().or(z.literal("")),
  phone: z.string().min(1),
  whatsapp: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().min(1),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  googleMapsEmbed: z.string().optional().nullable(),
  monday: z.string().min(1),
  tuesday: z.string().min(1),
  wednesday: z.string().min(1),
  thursday: z.string().min(1),
  friday: z.string().min(1),
  saturday: z.string().min(1),
  sunday: z.string().min(1),
});

export async function updateGymSettings(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(MANAGE_SETTINGS_ROLES);
  const raw = Object.fromEntries(formData.entries());
  const parsed = gymSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { monday, tuesday, wednesday, thursday, friday, saturday, sunday, ...rest } = parsed.data;
  const data = {
    ...rest,
    logoUrl: rest.logoUrl || null,
    logoDarkUrl: rest.logoDarkUrl || null,
    logoLightUrl: rest.logoLightUrl || null,
    faviconUrl: rest.faviconUrl || null,
    openingHours: { monday, tuesday, wednesday, thursday, friday, saturday, sunday },
  };
  await prisma.gymSettings.upsert({
    where: { id: SINGLETON_ID },
    create: { id: SINGLETON_ID, ...data },
    update: data,
  });
  await logActivity({ userId: session.id, action: "UPDATE", entityType: "GymSettings", entityId: SINGLETON_ID, description: `${session.name} updated brand & business settings` });
  revalidatePath("/", "layout");
  revalidatePath("/admin/branding");
  return { success: true };
}

const hexColor = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Use a valid hex color, e.g. #d4ff3f");

const themeSchema = z.object({
  primaryColor: hexColor,
  secondaryColor: hexColor,
  accentColor: hexColor,
  backgroundColor: hexColor,
  foregroundColor: hexColor,
  mutedColor: hexColor,
  buttonStyle: z.enum(["ROUNDED", "PILL", "SQUARE"]),
  borderRadius: z.string().regex(/^[0-9.]+(rem|px)$/, "Use a value like 0.75rem"),
  fontHeading: z.enum(["Anton", "Bebas Neue", "Oswald", "Poppins"]),
  fontBody: z.enum(["Inter", "Manrope", "Poppins"]),
});

export async function updateThemeSettings(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(MANAGE_SETTINGS_ROLES);
  const parsed = themeSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  await prisma.themeSettings.upsert({
    where: { id: SINGLETON_ID },
    create: { id: SINGLETON_ID, ...parsed.data },
    update: parsed.data,
  });
  await logActivity({ userId: session.id, action: "UPDATE", entityType: "ThemeSettings", entityId: SINGLETON_ID, description: `${session.name} updated the theme` });
  revalidatePath("/", "layout");
  revalidatePath("/admin/theme");
  return { success: true };
}

const seoSchema = z.object({
  defaultTitle: z.string().min(1),
  titleTemplate: z.string().min(1),
  defaultDescription: z.string().min(1),
  ogImage: z.string().url().optional().nullable().or(z.literal("")),
  canonicalUrl: z.string().url(),
  keywords: z.string().min(1),
  robotsIndex: z.coerce.boolean(),
  robotsFollow: z.coerce.boolean(),
  structuredDataType: z.string().min(1),
});

export async function updateSEOSettings(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(MANAGE_SETTINGS_ROLES);
  const parsed = seoSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    robotsIndex: formData.get("robotsIndex") === "true",
    robotsFollow: formData.get("robotsFollow") === "true",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const data = { ...parsed.data, ogImage: parsed.data.ogImage || null };
  await prisma.sEOSettings.upsert({
    where: { id: SINGLETON_ID },
    create: { id: SINGLETON_ID, ...data },
    update: data,
  });
  await logActivity({ userId: session.id, action: "UPDATE", entityType: "SEOSettings", entityId: SINGLETON_ID, description: `${session.name} updated SEO settings` });
  revalidatePath("/", "layout");
  revalidatePath("/admin/seo");
  return { success: true };
}

const footerSchema = z.object({
  description: z.string().min(1),
  copyrightText: z.string().min(1),
  newsletterEnabled: z.coerce.boolean(),
  newsletterHeading: z.string().min(1),
});

export async function updateFooterSettings(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(MANAGE_SETTINGS_ROLES);
  const parsed = footerSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    newsletterEnabled: formData.get("newsletterEnabled") === "true",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  await prisma.footerSettings.upsert({
    where: { id: SINGLETON_ID },
    create: { id: SINGLETON_ID, ...parsed.data },
    update: parsed.data,
  });
  await logActivity({ userId: session.id, action: "UPDATE", entityType: "FooterSettings", entityId: SINGLETON_ID, description: `${session.name} updated footer settings` });
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { success: true };
}
