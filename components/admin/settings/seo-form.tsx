"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SubmitButton } from "@/components/admin/submit-button";
import { ImagePicker } from "@/components/admin/media/image-picker";
import { updateSEOSettings } from "@/lib/actions/settings";
import type { SEOSettings } from "@prisma/client";

export function SEOForm({ seo }: { seo: SEOSettings }) {
  const [state, formAction] = useActionState(updateSEOSettings, {});
  const [ogImage, setOgImage] = useState(seo.ogImage ?? "");

  useEffect(() => {
    if (state.success) toast.success("SEO settings updated");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="defaultTitle">Default Page Title</Label>
        <Input id="defaultTitle" name="defaultTitle" required defaultValue={seo.defaultTitle} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="titleTemplate">Title Template</Label>
        <Input id="titleTemplate" name="titleTemplate" required defaultValue={seo.titleTemplate} />
        <p className="text-xs text-foreground/40">Use %s where the page title should appear.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="defaultDescription">Meta Description</Label>
        <Textarea id="defaultDescription" name="defaultDescription" required rows={3} defaultValue={seo.defaultDescription} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="keywords">Keywords (comma separated)</Label>
        <Input id="keywords" name="keywords" required defaultValue={seo.keywords} />
      </div>
      <ImagePicker label="Default OG Image" name="ogImage" value={ogImage} onChange={setOgImage} folder="seo" required={false} />
      <div className="space-y-2">
        <Label htmlFor="canonicalUrl">Canonical Site URL</Label>
        <Input id="canonicalUrl" name="canonicalUrl" required defaultValue={seo.canonicalUrl} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="structuredDataType">Structured Data Business Type</Label>
        <Input id="structuredDataType" name="structuredDataType" required defaultValue={seo.structuredDataType} />
      </div>
      <div className="flex items-center gap-8">
        <label className="flex items-center gap-2 text-sm">
          <Switch name="robotsIndex" defaultChecked={seo.robotsIndex} /> Allow Indexing
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch name="robotsFollow" defaultChecked={seo.robotsFollow} /> Allow Following Links
        </label>
      </div>
      <SubmitButton className="bg-brand text-black hover:bg-brand/90">Save SEO Settings</SubmitButton>
    </form>
  );
}
