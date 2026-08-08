import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { GalleryItemForm } from "@/components/admin/gallery/gallery-item-form";
import { createGalleryItem } from "@/lib/actions/gallery";

export default function NewGalleryItemPage() {
  return (
    <div>
      <AdminPageHeader title="New Gallery Image" backHref="/admin/gallery" />
      <GalleryItemForm action={createGalleryItem} />
    </div>
  );
}
