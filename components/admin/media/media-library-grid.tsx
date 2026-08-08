"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Copy, Video } from "lucide-react";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteMediaAsset } from "@/lib/actions/media";
import { Badge } from "@/components/ui/badge";
import type { MediaAsset } from "@prisma/client";

export function MediaLibraryGrid({ assets }: { assets: MediaAsset[] }) {
  const [items, setItems] = useState(assets);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((asset) => (
        <div key={asset.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/2">
          <div className="relative aspect-square">
            {asset.type === "IMAGE" ? (
              <Image
                src={asset.url}
                alt={asset.altText}
                fill
                sizes="(max-width: 640px) 50vw, 20vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-black/40">
                <Video className="h-8 w-8 text-foreground/40" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                onClick={() => {
                  navigator.clipboard.writeText(asset.url);
                  toast.success("URL copied");
                }}
                aria-label="Copy URL"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <ConfirmDeleteButton
                itemLabel="this file"
                onDelete={async () => {
                  await deleteMediaAsset(asset.id);
                  setItems((prev) => prev.filter((a) => a.id !== asset.id));
                }}
              />
            </div>
          </div>
          <div className="p-2">
            <Badge variant="secondary" className="text-[10px]">
              {asset.folder}
            </Badge>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <p className="col-span-full py-10 text-center text-foreground/50">
          No media uploaded yet. Images uploaded from any content form will appear here.
        </p>
      )}
    </div>
  );
}
