import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { GalleryItemForm } from "@/components/admin/gallery/gallery-item-form";
import { updateGalleryItem } from "@/lib/actions/gallery";

export default async function EditGalleryItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Gallery Image" backHref="/admin/gallery" />
      <GalleryItemForm action={updateGalleryItem.bind(null, id)} item={item} />
    </div>
  );
}
