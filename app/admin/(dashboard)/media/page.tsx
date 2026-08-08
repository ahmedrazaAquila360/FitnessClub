import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MediaLibraryGrid } from "@/components/admin/media/media-library-grid";
import { MediaUploader } from "@/components/admin/media/media-uploader";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="heading-font text-2xl tracking-wide">MEDIA LIBRARY</h1>
          <p className="mt-1 text-sm text-foreground/50">
            Every image and video uploaded across your website.
          </p>
        </div>
        <MediaUploader />
      </div>
      <MediaLibraryGrid assets={assets} />
    </div>
  );
}
