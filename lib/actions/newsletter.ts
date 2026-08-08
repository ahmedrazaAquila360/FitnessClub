"use server";

import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/lib/actions/types";
import { z } from "zod";

const emailSchema = z.string().email("Enter a valid email address");

export async function subscribeNewsletter(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data },
    create: { email: parsed.data },
    update: {},
  });

  return { success: true };
}
