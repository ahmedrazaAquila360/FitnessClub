"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/admin/submit-button";
import { ImagePicker } from "@/components/admin/media/image-picker";
import { ICON_NAMES } from "@/lib/icon-map";
import type { ActionResult } from "@/lib/actions/types";
import type { Program } from "@prisma/client";

type Action = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;

export function ProgramForm({
  action,
  program,
  trainers,
}: {
  action: Action;
  program?: Program;
  trainers: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, {});
  const [name, setName] = useState(program?.name ?? "");
  const [slug, setSlug] = useState(program?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(program));
  const [image, setImage] = useState(program?.image ?? "");

  useEffect(() => {
    if (state.success) {
      toast.success(program ? "Program updated" : "Program created");
      router.push("/admin/programs");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, program, router]);

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
        <Label htmlFor="shortDescription">Short Description</Label>
        <Input
          id="shortDescription"
          name="shortDescription"
          required
          defaultValue={program?.shortDescription}
          placeholder="One sentence shown on cards"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          rows={5}
          defaultValue={program?.description}
        />
      </div>

      <ImagePicker label="Program Image" name="image" value={image} onChange={setImage} folder="programs" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" required defaultValue={program?.category ?? "Strength"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" name="duration" required defaultValue={program?.duration ?? "60 min"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select name="difficulty" defaultValue={program?.difficulty ?? "ALL_LEVELS"}>
            <SelectTrigger className="w-full" id="difficulty">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BEGINNER">Beginner</SelectItem>
              <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
              <SelectItem value="ADVANCED">Advanced</SelectItem>
              <SelectItem value="ALL_LEVELS">All Levels</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <Select name="icon" defaultValue={program?.icon ?? "Dumbbell"}>
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
          <Label htmlFor="trainerId">Trainer</Label>
          <Select name="trainerId" defaultValue={program?.trainerId ?? "none"}>
            <SelectTrigger className="w-full" id="trainerId">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Unassigned</SelectItem>
              {trainers.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="ctaLabel">CTA Label</Label>
          <Input id="ctaLabel" name="ctaLabel" required defaultValue={program?.ctaLabel ?? "Explore Program"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ctaHref">CTA Link (optional)</Label>
          <Input id="ctaHref" name="ctaHref" defaultValue={program?.ctaHref ?? ""} placeholder="/membership" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Display Order</Label>
          <Input id="order" name="order" type="number" defaultValue={program?.order ?? 0} />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <label className="flex items-center gap-2 text-sm">
          <Switch name="isFeatured" defaultChecked={program?.isFeatured} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch name="isActive" defaultChecked={program?.isActive ?? true} /> Active
        </label>
      </div>

      <SubmitButton className="bg-brand text-black hover:bg-brand/90">
        {program ? "Save Changes" : "Create Program"}
      </SubmitButton>
    </form>
  );
}
