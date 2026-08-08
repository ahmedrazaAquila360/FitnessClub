"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, MANAGE_SETTINGS_ROLES } from "@/lib/auth/guards";
import { logActivity } from "@/lib/actions/activity";
import type { ActionResult } from "@/lib/actions/types";
import { revalidatePath } from "next/cache";
import { SINGLETON_ID } from "@/lib/constants";
import { z } from "zod";

const valueItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const aboutSchema = z.object({
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  description: z.string().min(1),
  image: z.string().url(),
  secondaryImage: z.string().url(),
  missionTitle: z.string().min(1),
  missionText: z.string().min(1),
  values: z.array(valueItemSchema).default([]),
  isActive: z.coerce.boolean().default(true),
});

export async function updateAbout(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(MANAGE_SETTINGS_ROLES);

  let values: unknown = [];
  try {
    values = JSON.parse(String(formData.get("values") || "[]"));
  } catch {
    return { error: "Invalid values payload." };
  }

  const parsed = aboutSchema.safeParse({
    eyebrow: formData.get("eyebrow"),
    heading: formData.get("heading"),
    description: formData.get("description"),
    image: formData.get("image"),
    secondaryImage: formData.get("secondaryImage"),
    missionTitle: formData.get("missionTitle"),
    missionText: formData.get("missionText"),
    values,
    isActive: formData.get("isActive") === "true",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  await prisma.aboutSection.upsert({
    where: { id: SINGLETON_ID },
    create: { id: SINGLETON_ID, ...parsed.data, values: parsed.data.values },
    update: { ...parsed.data, values: parsed.data.values },
  });
  await logActivity({ userId: session.id, action: "UPDATE", entityType: "AboutSection", entityId: SINGLETON_ID, description: `${session.name} updated the About section` });
  revalidatePath("/");
  revalidatePath("/admin/about");
  return { success: true };
}
