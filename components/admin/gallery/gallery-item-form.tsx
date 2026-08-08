"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubmitButton } from "@/components/admin/submit-button";
import { ImagePicker } from "@/components/admin/media/image-picker";
import { GALLERY_CATEGORY_LABELS } from "@/lib/constants";
import type { ActionResult } from "@/lib/actions/types";
import type { GalleryItem } from "@prisma/client";

type Action = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;

export function GalleryItemForm({ action, item }: { action: Action; item?: GalleryItem }) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, {});
  const [image, setImage] = useState(item?.image ?? "");

  useEffect(() => {
    if (state.success) {
      toast.success(item ? "Image updated" : "Image added");
      router.push("/admin/gallery");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, item, router]);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <ImagePicker label="Image" name="image" value={image} onChange={setImage} folder="gallery" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category" defaultValue={item?.category ?? "GYM"}>
            <SelectTrigger className="w-full" id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(GALLERY_CATEGORY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Display Order</Label>
          <Input id="order" name="order" type="number" defaultValue={item?.order ?? 0} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="caption">Caption (optional)</Label>
        <Input id="caption" name="caption" defaultValue={item?.caption ?? ""} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="altText">Alt Text</Label>
        <Input id="altText" name="altText" defaultValue={item?.altText ?? ""} placeholder="Describe the image for accessibility" />
      </div>

      <div className="flex items-center gap-8">
        <label className="flex items-center gap-2 text-sm">
          <Switch name="isFeatured" defaultChecked={item?.isFeatured} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch name="isActive" defaultChecked={item?.isActive ?? true} /> Active
        </label>
      </div>

      <SubmitButton className="bg-brand text-black hover:bg-brand/90">
        {item ? "Save Changes" : "Add Image"}
      </SubmitButton>
    </form>
  );
}
