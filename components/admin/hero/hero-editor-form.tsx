"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubmitButton } from "@/components/admin/submit-button";
import { ImagePicker } from "@/components/admin/media/image-picker";
import { updateHero } from "@/lib/actions/hero";
import type { HeroSection } from "@prisma/client";

export function HeroEditorForm({ hero }: { hero: HeroSection }) {
  const [state, formAction] = useActionState(updateHero, {});
  const [backgroundImage, setBackgroundImage] = useState(hero.backgroundImage);

  useEffect(() => {
    if (state.success) toast.success("Hero section updated");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="badge">Badge</Label>
        <Input id="badge" name="badge" required defaultValue={hero.badge} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="heading">Heading (line 1)</Label>
          <Input id="heading" name="heading" required defaultValue={hero.heading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="headingHighlight">Heading (line 2, accent)</Label>
          <Input id="headingHighlight" name="headingHighlight" required defaultValue={hero.headingHighlight} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required rows={3} defaultValue={hero.description} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="primaryCtaLabel">Primary CTA Label</Label>
          <Input id="primaryCtaLabel" name="primaryCtaLabel" required defaultValue={hero.primaryCtaLabel} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="primaryCtaHref">Primary CTA Link</Label>
          <Input id="primaryCtaHref" name="primaryCtaHref" required defaultValue={hero.primaryCtaHref} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="secondaryCtaLabel">Secondary CTA Label</Label>
          <Input id="secondaryCtaLabel" name="secondaryCtaLabel" required defaultValue={hero.secondaryCtaLabel} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="secondaryCtaHref">Secondary CTA Link</Label>
          <Input id="secondaryCtaHref" name="secondaryCtaHref" required defaultValue={hero.secondaryCtaHref} />
        </div>
      </div>

      <ImagePicker
        label="Background Image"
        name="backgroundImage"
        value={backgroundImage}
        onChange={setBackgroundImage}
        folder="hero"
      />

      <div className="space-y-2">
        <Label htmlFor="backgroundVideo">Background Video URL (optional, overrides image)</Label>
        <Input id="backgroundVideo" name="backgroundVideo" defaultValue={hero.backgroundVideo ?? ""} placeholder="https://.../hero.mp4" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="overlayOpacity">Overlay Opacity (0–1)</Label>
          <Input
            id="overlayOpacity"
            name="overlayOpacity"
            type="number"
            min={0}
            max={1}
            step={0.05}
            defaultValue={hero.overlayOpacity}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="textAlign">Text Alignment</Label>
          <Select name="textAlign" defaultValue={hero.textAlign}>
            <SelectTrigger className="w-full" id="textAlign">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LEFT">Left</SelectItem>
              <SelectItem value="CENTER">Center</SelectItem>
              <SelectItem value="RIGHT">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="animationType">Entrance Animation</Label>
          <Select name="animationType" defaultValue={hero.animationType}>
            <SelectTrigger className="w-full" id="animationType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FADE_UP">Fade Up</SelectItem>
              <SelectItem value="FADE_IN">Fade In</SelectItem>
              <SelectItem value="ZOOM_IN">Zoom In</SelectItem>
              <SelectItem value="SLIDE_LEFT">Slide Left</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <Switch name="isActive" defaultChecked={hero.isActive} /> Active
      </label>

      <SubmitButton className="bg-brand text-black hover:bg-brand/90">Save Hero</SubmitButton>
    </form>
  );
}
