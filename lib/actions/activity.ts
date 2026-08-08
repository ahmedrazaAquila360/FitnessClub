import "server-only";
import { prisma } from "@/lib/prisma";

export async function logActivity(input: {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  description: string;
}) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: input.userId ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        description: input.description,
      },
    });
  } catch {
    // Activity logging must never break the primary mutation.
  }
}
