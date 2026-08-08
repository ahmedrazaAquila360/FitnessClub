"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, ALL_ROLES } from "@/lib/auth/guards";
import { logActivity } from "@/lib/actions/activity";
import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import path from "path";

export async function deleteMediaAsset(id: string) {
  const session = await requireRole(ALL_ROLES);
  const asset = await prisma.mediaAsset.delete({ where: { id } });
  try {
    if (asset.url.startsWith("/uploads/")) {
      await unlink(path.join(process.cwd(), "public", asset.url));
    }
  } catch {
    // File may already be gone; the DB record is the source of truth.
  }
  await logActivity({ userId: session.id, action: "DELETE", entityType: "MediaAsset", entityId: id, description: `${session.name} deleted a media asset` });
  revalidatePath("/admin/media");
}

export async function updateMediaAssetMeta(id: string, altText: string, caption: string) {
  const session = await requireRole(ALL_ROLES);
  await prisma.mediaAsset.update({ where: { id }, data: { altText, caption } });
  await logActivity({ userId: session.id, action: "UPDATE", entityType: "MediaAsset", entityId: id, description: `${session.name} updated media metadata` });
  revalidatePath("/admin/media");
}
