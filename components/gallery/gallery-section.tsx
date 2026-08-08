import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getGalleryItems } from "@/lib/data/content";
import { Reveal } from "@/components/animations/reveal";
import { GalleryGrid } from "@/components/gallery/gallery-grid";

export async function GallerySection() {
  const items = await getGalleryItems();
  if (items.length === 0) return null;

  return (
    <section id="gallery" className="relative bg-background py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mb-14 flex flex-col items-end justify-between gap-6 sm:flex-row">
          <div>
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                Gallery
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="heading-font mt-4 max-w-xl text-4xl leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
                INSIDE THE GRIND
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <Link
              href="/gallery"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors hover:border-brand hover:text-brand"
            >
              View Full Gallery
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <GalleryGrid items={items.slice(0, 12)} />
      </div>
    </section>
  );
}
