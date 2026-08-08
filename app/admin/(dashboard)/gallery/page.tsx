import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteGalleryItem } from "@/lib/actions/gallery";
import { GALLERY_CATEGORY_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <AdminPageHeader
        title="Gallery"
        description="Upload and organize images shown in the public gallery."
        action={{ href: "/admin/gallery/new", label: "New Image" }}
      />
      {items.length === 0 ? (
        <p className="py-10 text-center text-foreground/50">No gallery images yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-2xl border border-white/10">
              <Link href={`/admin/gallery/${item.id}`} className="block aspect-square relative">
                <Image
                  src={item.image}
                  alt={item.altText || ""}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
              </Link>
              <div className="absolute left-2 top-2">
                <Badge variant="secondary" className="text-[10px]">
                  {GALLERY_CATEGORY_LABELS[item.category]}
                </Badge>
              </div>
              <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                <ConfirmDeleteButton itemLabel="this image" onDelete={deleteGalleryItem.bind(null, item.id)} />
              </div>
              {!item.isActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <span className="text-xs font-semibold uppercase text-foreground/70">Hidden</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
