import { prisma } from "@/lib/prisma";
import { MediaLibraryGrid } from "@/components/admin/media/media-library-grid";
import { MediaUploader } from "@/components/admin/media/media-uploader";
import { parsePage, getPagination } from "@/lib/pagination";
import { PaginationControls } from "@/components/admin/pagination-controls";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const totalItems = await prisma.mediaAsset.count();
  const { skip, take, currentPage, totalPages } = getPagination(parsePage(pageParam), totalItems, PAGE_SIZE);
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, skip, take });

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
      <PaginationControls
        basePath="/admin/media"
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={take}
      />
    </div>
  );
}
