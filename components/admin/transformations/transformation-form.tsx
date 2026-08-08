"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SubmitButton } from "@/components/admin/submit-button";
import { ImagePicker } from "@/components/admin/media/image-picker";
import type { ActionResult } from "@/lib/actions/types";
import type { Transformation } from "@prisma/client";

type Action = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;

export function TransformationForm({
  action,
  transformation,
}: {
  action: Action;
  transformation?: Transformation;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, {});
  const [beforeImage, setBeforeImage] = useState(transformation?.beforeImage ?? "");
  const [afterImage, setAfterImage] = useState(transformation?.afterImage ?? "");

  useEffect(() => {
    if (state.success) {
      toast.success(transformation ? "Story updated" : "Story added");
      router.push("/admin/transformations");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, transformation, router]);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="memberName">Member Name</Label>
        <Input id="memberName" name="memberName" required defaultValue={transformation?.memberName} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <ImagePicker label="Before Image" name="beforeImage" value={beforeImage} onChange={setBeforeImage} folder="transformations" />
        <ImagePicker label="After Image" name="afterImage" value={afterImage} onChange={setAfterImage} folder="transformations" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" name="duration" required defaultValue={transformation?.duration} placeholder="6 Months" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="goal">Goal</Label>
          <Input id="goal" name="goal" required defaultValue={transformation?.goal} placeholder="Fat Loss" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="story">Story</Label>
        <Textarea id="story" name="story" required rows={4} defaultValue={transformation?.story} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="result">Result</Label>
        <Input id="result" name="result" required defaultValue={transformation?.result} placeholder="Lost 32 lbs, gained visible core strength" />
      </div>

      <div className="space-y-2 sm:max-w-[200px]">
        <Label htmlFor="order">Display Order</Label>
        <Input id="order" name="order" type="number" defaultValue={transformation?.order ?? 0} />
      </div>

      <div className="flex items-center gap-8">
        <label className="flex items-center gap-2 text-sm">
          <Switch name="isFeatured" defaultChecked={transformation?.isFeatured} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch name="isActive" defaultChecked={transformation?.isActive ?? true} /> Active
        </label>
      </div>

      <SubmitButton className="bg-brand text-black hover:bg-brand/90">
        {transformation ? "Save Changes" : "Add Story"}
      </SubmitButton>
    </form>
  );
}
