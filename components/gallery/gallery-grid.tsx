"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { cn } from "@/lib/utils";
import { GALLERY_CATEGORY_LABELS } from "@/lib/constants";

export type GalleryItemData = {
  id: string;
  image: string;
  category: string;
  caption: string | null;
  altText: string;
};

export function GalleryGrid({
  items,
  showFilters = false,
}: {
  items: GalleryItemData[];
  showFilters?: boolean;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = Array.from(new Set(items.map((i) => i.category)));
  const filtered =
    activeCategory === "ALL" ? items : items.filter((i) => i.category === activeCategory);

  return (
    <div>
      {showFilters && categories.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("ALL")}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
              activeCategory === "ALL"
                ? "border-brand bg-brand text-black"
                : "border-white/15 text-foreground/60 hover:border-white/40"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
                activeCategory === cat
                  ? "border-brand bg-brand text-black"
                  : "border-white/15 text-foreground/60 hover:border-white/40"
              )}
            >
              {GALLERY_CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>
      )}

      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
        {filtered.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setLightboxIndex(i)}
            data-cursor="view"
            className="group relative mb-4 block w-full overflow-hidden rounded-2xl break-inside-avoid"
          >
            <Image
              src={item.image}
              alt={item.altText || item.caption || "Gallery image"}
              width={600}
              height={800}
              className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex w-full items-center justify-between p-4">
                {item.caption && <p className="text-xs text-white/90">{item.caption}</p>}
                <Expand className="h-4 w-4 text-white/80" />
              </div>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white sm:left-8"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <motion.img
              key={filtered[lightboxIndex].id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={filtered[lightboxIndex].image}
              alt={filtered[lightboxIndex].altText || "Gallery image"}
              className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white sm:right-8"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));
              }}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
