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
import type { ActionResult } from "@/lib/actions/types";
import type { Testimonial } from "@prisma/client";

type Action = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;

export function TestimonialForm({ action, testimonial }: { action: Action; testimonial?: Testimonial }) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, {});
  const [image, setImage] = useState(testimonial?.image ?? "");

  useEffect(() => {
    if (state.success) {
      toast.success(testimonial ? "Testimonial updated" : "Testimonial added");
      router.push("/admin/testimonials");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, testimonial, router]);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required defaultValue={testimonial?.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="membership">Membership</Label>
          <Input id="membership" name="membership" required defaultValue={testimonial?.membership ?? "Member"} />
        </div>
      </div>

      <ImagePicker
        label="Photo (optional)"
        name="image"
        value={image}
        onChange={setImage}
        folder="testimonials"
        required={false}
      />

      <div className="space-y-2">
        <Label htmlFor="content">Testimonial</Label>
        <Textarea id="content" name="content" required rows={4} defaultValue={testimonial?.content} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="rating">Rating</Label>
          <Select name="rating" defaultValue={String(testimonial?.rating ?? 5)}>
            <SelectTrigger className="w-full" id="rating">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 4, 3, 2, 1].map((r) => (
                <SelectItem key={r} value={String(r)}>
                  {r} Star{r > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Display Order</Label>
          <Input id="order" name="order" type="number" defaultValue={testimonial?.order ?? 0} />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <label className="flex items-center gap-2 text-sm">
          <Switch name="isFeatured" defaultChecked={testimonial?.isFeatured} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch name="isActive" defaultChecked={testimonial?.isActive ?? true} /> Active
        </label>
      </div>

      <SubmitButton className="bg-brand text-black hover:bg-brand/90">
        {testimonial ? "Save Changes" : "Add Testimonial"}
      </SubmitButton>
    </form>
  );
}
