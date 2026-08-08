"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SubmitButton } from "@/components/admin/submit-button";
import type { ActionResult } from "@/lib/actions/types";
import type { FAQ } from "@prisma/client";

type Action = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;

export function FAQForm({ action, faq }: { action: Action; faq?: FAQ }) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, {});

  useEffect(() => {
    if (state.success) {
      toast.success(faq ? "FAQ updated" : "FAQ added");
      router.push("/admin/faqs");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, faq, router]);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <Input id="question" name="question" required defaultValue={faq?.question} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="answer">Answer</Label>
        <Textarea id="answer" name="answer" required rows={4} defaultValue={faq?.answer} />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" defaultValue={faq?.category ?? "General"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Display Order</Label>
          <Input id="order" name="order" type="number" defaultValue={faq?.order ?? 0} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Switch name="isActive" defaultChecked={faq?.isActive ?? true} /> Active
      </label>
      <SubmitButton className="bg-brand text-black hover:bg-brand/90">
        {faq ? "Save Changes" : "Add FAQ"}
      </SubmitButton>
    </form>
  );
}
