"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import type { ActionResult } from "@/lib/actions/types";
import type { MembershipPlan } from "@prisma/client";

type Action = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;

export function MembershipForm({ action, plan }: { action: Action; plan?: MembershipPlan }) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, {});

  useEffect(() => {
    if (state.success) {
      toast.success(plan ? "Plan updated" : "Plan created");
      router.push("/admin/memberships");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, plan, router]);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Plan Name</Label>
        <Input id="name" name="name" required defaultValue={plan?.name} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input id="price" name="price" type="number" step="0.01" required defaultValue={plan?.price.toString()} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="billingPeriod">Billing Period</Label>
          <Select name="billingPeriod" defaultValue={plan?.billingPeriod ?? "MONTHLY"}>
            <SelectTrigger className="w-full" id="billingPeriod">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="QUARTERLY">Quarterly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required rows={2} defaultValue={plan?.description} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Features (one per line)</Label>
        <Textarea
          id="features"
          name="features"
          rows={6}
          defaultValue={plan?.features.join("\n")}
          placeholder={"Unlimited gym access\nFree fitness assessment\n2 group classes / week"}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="ctaLabel">CTA Label</Label>
          <Input id="ctaLabel" name="ctaLabel" required defaultValue={plan?.ctaLabel ?? "Join Now"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ctaHref">CTA Link</Label>
          <Input id="ctaHref" name="ctaHref" required defaultValue={plan?.ctaHref ?? "/contact"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="badge">Badge (optional)</Label>
          <Input id="badge" name="badge" defaultValue={plan?.badge ?? ""} placeholder="Most Popular" />
        </div>
      </div>

      <div className="space-y-2 sm:max-w-[200px]">
        <Label htmlFor="order">Display Order</Label>
        <Input id="order" name="order" type="number" defaultValue={plan?.order ?? 0} />
      </div>

      <div className="flex items-center gap-8">
        <label className="flex items-center gap-2 text-sm">
          <Switch name="isFeatured" defaultChecked={plan?.isFeatured} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch name="isActive" defaultChecked={plan?.isActive ?? true} /> Active
        </label>
      </div>

      <SubmitButton className="bg-brand text-black hover:bg-brand/90">
        {plan ? "Save Changes" : "Create Plan"}
      </SubmitButton>
    </form>
  );
}
