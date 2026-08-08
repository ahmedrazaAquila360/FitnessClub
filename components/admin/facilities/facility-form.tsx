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
import type { Facility } from "@prisma/client";

type Action = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;

export function FacilityForm({ action, facility }: { action: Action; facility?: Facility }) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, {});
  const [image, setImage] = useState(facility?.image ?? "");

  useEffect(() => {
    if (state.success) {
      toast.success(facility ? "Facility updated" : "Facility added");
      router.push("/admin/facilities");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, facility, router]);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required defaultValue={facility?.name} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required rows={3} defaultValue={facility?.description} />
      </div>
      <ImagePicker label="Image" name="image" value={image} onChange={setImage} folder="facilities" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <Select name="icon" defaultValue={facility?.icon ?? "Building2"}>
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
          <Input id="order" name="order" type="number" defaultValue={facility?.order ?? 0} />
        </div>
      </div>
      <div className="flex items-center gap-8">
        <label className="flex items-center gap-2 text-sm">
          <Switch name="isFeatured" defaultChecked={facility?.isFeatured} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch name="isActive" defaultChecked={facility?.isActive ?? true} /> Active
        </label>
      </div>
      <SubmitButton className="bg-brand text-black hover:bg-brand/90">
        {facility ? "Save Changes" : "Add Facility"}
      </SubmitButton>
    </form>
  );
}
