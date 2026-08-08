"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/admin/submit-button";
import { ImagePicker } from "@/components/admin/media/image-picker";
import { updateAbout } from "@/lib/actions/about";
import type { AboutSection } from "@prisma/client";

type ValueItem = { title: string; description: string };

export function AboutForm({ about }: { about: AboutSection }) {
  const [state, formAction] = useActionState(updateAbout, {});
  const [image, setImage] = useState(about.image);
  const [secondaryImage, setSecondaryImage] = useState(about.secondaryImage);
  const [values, setValues] = useState<ValueItem[]>(
    Array.isArray(about.values) ? (about.values as ValueItem[]) : []
  );

  useEffect(() => {
    if (state.success) toast.success("About section updated");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <input type="hidden" name="values" value={JSON.stringify(values)} />

      <div className="space-y-2">
        <Label htmlFor="eyebrow">Eyebrow</Label>
        <Input id="eyebrow" name="eyebrow" required defaultValue={about.eyebrow} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="heading">Heading</Label>
        <Input id="heading" name="heading" required defaultValue={about.heading} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required rows={4} defaultValue={about.description} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <ImagePicker label="Primary Image" name="image" value={image} onChange={setImage} folder="about" />
        <ImagePicker label="Secondary Image" name="secondaryImage" value={secondaryImage} onChange={setSecondaryImage} folder="about" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="missionTitle">Mission Title</Label>
        <Input id="missionTitle" name="missionTitle" required defaultValue={about.missionTitle} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="missionText">Mission Text</Label>
        <Textarea id="missionText" name="missionText" required rows={3} defaultValue={about.missionText} />
      </div>

      <div className="space-y-3">
        <Label>Core Values</Label>
        {values.map((value, i) => (
          <div key={i} className="flex gap-2 rounded-xl border border-white/10 bg-white/2 p-4">
            <div className="flex-1 space-y-2">
              <Input
                value={value.title}
                onChange={(e) => {
                  const next = [...values];
                  next[i] = { ...next[i], title: e.target.value };
                  setValues(next);
                }}
                placeholder="Value title"
              />
              <Textarea
                value={value.description}
                onChange={(e) => {
                  const next = [...values];
                  next[i] = { ...next[i], description: e.target.value };
                  setValues(next);
                }}
                rows={2}
                placeholder="Value description"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setValues(values.filter((_, idx) => idx !== i))}
              className="text-foreground/50 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => setValues([...values, { title: "", description: "" }])}
        >
          <Plus className="h-3.5 w-3.5" /> Add Value
        </Button>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <Switch name="isActive" defaultChecked={about.isActive} /> Active
      </label>

      <SubmitButton className="bg-brand text-black hover:bg-brand/90">Save About Section</SubmitButton>
    </form>
  );
}
