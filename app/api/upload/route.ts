import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/actions/activity";

export const runtime = "nodejs";

const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
]);

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") || "general").replace(/[^a-z0-9-]/gi, "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File is too large (max 8MB)" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || (file.type.startsWith("video") ? ".mp4" : ".jpg");
  const safeBase = path
    .basename(file.name, ext)
    .replace(/[^a-z0-9-_]/gi, "-")
    .slice(0, 60);
  const filename = `${Date.now()}-${safeBase}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), bytes);

  const url = `/uploads/${folder}/${filename}`;
  const asset = await prisma.mediaAsset.create({
    data: {
      url,
      type: file.type.startsWith("video") ? "VIDEO" : "IMAGE",
      folder,
      size: file.size,
    },
  });

  await logActivity({
    userId: session.id,
    action: "UPLOAD",
    entityType: "MediaAsset",
    entityId: asset.id,
    description: `${session.name} uploaded a file to the media library`,
  });

  return NextResponse.json({ id: asset.id, url: asset.url });
}
