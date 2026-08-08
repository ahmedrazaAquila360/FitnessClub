"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SubmitButton } from "@/components/admin/submit-button";
import { updateFooterSettings } from "@/lib/actions/settings";
import type { FooterSettings } from "@prisma/client";

export function FooterForm({ footer }: { footer: FooterSettings }) {
  const [state, formAction] = useActionState(updateFooterSettings, {});

  useEffect(() => {
    if (state.success) toast.success("Footer settings updated");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="description">Footer Description</Label>
        <Textarea id="description" name="description" required rows={3} defaultValue={footer.description} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="copyrightText">Copyright Text</Label>
        <Input id="copyrightText" name="copyrightText" required defaultValue={footer.copyrightText} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newsletterHeading">Newsletter Heading</Label>
        <Input id="newsletterHeading" name="newsletterHeading" required defaultValue={footer.newsletterHeading} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Switch name="newsletterEnabled" defaultChecked={footer.newsletterEnabled} /> Show newsletter signup
      </label>
      <SubmitButton className="bg-brand text-black hover:bg-brand/90">Save Footer Settings</SubmitButton>
    </form>
  );
}
