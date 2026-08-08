import type { Metadata } from "next";
import { getGalleryItems } from "@/lib/data/content";
import { PageHeader } from "@/components/layout/page-header";
import { GalleryGrid } from "@/components/gallery/gallery-grid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A look inside Apex Athletic — the gym, the equipment, the classes and the community.",
};

export const revalidate = 300;

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="INSIDE THE GRIND"
        description="The floor, the equipment, the classes, the moments — a look at life inside Apex Athletic."
      />
      <section className="bg-background pb-28 pt-8 sm:pb-36">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <GalleryGrid items={items} showFilters />
        </div>
      </section>
    </>
  );
}
