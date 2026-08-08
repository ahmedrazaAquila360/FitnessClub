"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubmitButton } from "@/components/admin/submit-button";
import { ImagePicker } from "@/components/admin/media/image-picker";
import { ICON_NAMES } from "@/lib/icon-map";
import type { ActionResult } from "@/lib/actions/types";
import type { WhyChooseUsItem } from "@prisma/client";

type Action = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;

export function WhyChooseUsForm({ action, item }: { action: Action; item?: WhyChooseUsItem }) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, {});
  const [image, setImage] = useState(item?.image ?? "");

  useEffect(() => {
    if (state.success) {
      toast.success(item ? "Item updated" : "Item added");
      router.push("/admin/why-choose-us");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, item, router]);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required defaultValue={item?.title} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required rows={3} defaultValue={item?.description} />
      </div>
      <ImagePicker
        label="Image (optional)"
        name="image"
        value={image}
        onChange={setImage}
        folder="why-choose-us"
        required={false}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <Select name="icon" defaultValue={item?.icon ?? "Trophy"}>
            <SelectTrigger className="w-full" id="icon">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ICON_NAMES.map((icon) => (
                <SelectItem key={icon} value={icon}>
                  {icon}
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
      <label className="flex items-center gap-2 text-sm">
        <Switch name="isActive" defaultChecked={item?.isActive ?? true} /> Active
      </label>
      <SubmitButton className="bg-brand text-black hover:bg-brand/90">
        {item ? "Save Changes" : "Add Item"}
      </SubmitButton>
    </form>
  );
}
