"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SubmitButton } from "@/components/admin/submit-button";
import { ImagePicker } from "@/components/admin/media/image-picker";
import type { ActionResult } from "@/lib/actions/types";
import type { Trainer } from "@prisma/client";

type Action = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;

export function TrainerForm({ action, trainer }: { action: Action; trainer?: Trainer }) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, {});
  const [name, setName] = useState(trainer?.name ?? "");
  const [slug, setSlug] = useState(trainer?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(trainer));
  const [image, setImage] = useState(trainer?.image ?? "");

  useEffect(() => {
    if (state.success) {
      toast.success(trainer ? "Trainer updated" : "Trainer added");
      router.push("/admin/trainers");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, trainer, router]);

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Position</Label>
        <Input id="position" name="position" required defaultValue={trainer?.position} placeholder="Head Strength Coach" />
      </div>

      <ImagePicker label="Profile Image" name="image" value={image} onChange={setImage} folder="trainers" />

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" required rows={4} defaultValue={trainer?.bio} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="specialization">Specializations (one per line)</Label>
          <Textarea
            id="specialization"
            name="specialization"
            rows={4}
            defaultValue={trainer?.specialization.join("\n")}
            placeholder={"Strength Training\nOlympic Lifting"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="certifications">Certifications (one per line)</Label>
          <Textarea
            id="certifications"
            name="certifications"
            rows={4}
            defaultValue={trainer?.certifications.join("\n")}
            placeholder={"NASM-CPT\nUSA Weightlifting L2"}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="experienceYears">Years of Experience</Label>
          <Input id="experienceYears" name="experienceYears" type="number" defaultValue={trainer?.experienceYears ?? 1} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Display Order</Label>
          <Input id="order" name="order" type="number" defaultValue={trainer?.order ?? 0} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram URL</Label>
          <Input id="instagram" name="instagram" defaultValue={trainer?.instagram ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="facebook">Facebook URL</Label>
          <Input id="facebook" name="facebook" defaultValue={trainer?.facebook ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="twitter">X / Twitter URL</Label>
          <Input id="twitter" name="twitter" defaultValue={trainer?.twitter ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="youtube">YouTube URL</Label>
          <Input id="youtube" name="youtube" defaultValue={trainer?.youtube ?? ""} />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <label className="flex items-center gap-2 text-sm">
          <Switch name="isFeatured" defaultChecked={trainer?.isFeatured} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch name="isActive" defaultChecked={trainer?.isActive ?? true} /> Active
        </label>
      </div>

      <SubmitButton className="bg-brand text-black hover:bg-brand/90">
        {trainer ? "Save Changes" : "Add Trainer"}
      </SubmitButton>
    </form>
  );
}
