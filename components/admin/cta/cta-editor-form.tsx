"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SubmitButton } from "@/components/admin/submit-button";
import { ImagePicker } from "@/components/admin/media/image-picker";
import { updateCTA } from "@/lib/actions/cta";
import type { CTASection } from "@prisma/client";

export function CTAEditorForm({ cta }: { cta: CTASection }) {
  const [state, formAction] = useActionState(updateCTA, {});
  const [backgroundImage, setBackgroundImage] = useState(cta.backgroundImage);

  useEffect(() => {
    if (state.success) toast.success("CTA section updated");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="heading">Heading (line 1)</Label>
          <Input id="heading" name="heading" required defaultValue={cta.heading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="headingHighlight">Heading (line 2, accent)</Label>
          <Input id="headingHighlight" name="headingHighlight" required defaultValue={cta.headingHighlight} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required rows={3} defaultValue={cta.description} />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="primaryCtaLabel">Primary CTA Label</Label>
          <Input id="primaryCtaLabel" name="primaryCtaLabel" required defaultValue={cta.primaryCtaLabel} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="primaryCtaHref">Primary CTA Link</Label>
          <Input id="primaryCtaHref" name="primaryCtaHref" required defaultValue={cta.primaryCtaHref} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="secondaryCtaLabel">Secondary CTA Label</Label>
          <Input id="secondaryCtaLabel" name="secondaryCtaLabel" required defaultValue={cta.secondaryCtaLabel} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="secondaryCtaHref">Secondary CTA Link</Label>
          <Input id="secondaryCtaHref" name="secondaryCtaHref" required defaultValue={cta.secondaryCtaHref} />
        </div>
      </div>
      <ImagePicker
        label="Background Image"
        name="backgroundImage"
        value={backgroundImage}
        onChange={setBackgroundImage}
        folder="cta"
      />
      <label className="flex items-center gap-2 text-sm">
        <Switch name="isActive" defaultChecked={cta.isActive} /> Active
      </label>
      <SubmitButton className="bg-brand text-black hover:bg-brand/90">Save CTA</SubmitButton>
    </form>
  );
}
