"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubmitButton } from "@/components/admin/submit-button";
import { ColorField } from "@/components/admin/settings/color-field";
import { updateThemeSettings } from "@/lib/actions/settings";
import { HEADING_FONT_OPTIONS, BODY_FONT_OPTIONS } from "@/lib/fonts";
import type { ThemeSettings } from "@prisma/client";

export function ThemeForm({ theme }: { theme: ThemeSettings }) {
  const [state, formAction] = useActionState(updateThemeSettings, {});

  useEffect(() => {
    if (state.success) toast.success("Theme updated — refresh to see changes everywhere");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="max-w-3xl space-y-8">
      <section className="space-y-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">Colors</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <ColorField name="primaryColor" label="Primary / Accent" defaultValue={theme.primaryColor} />
          <ColorField name="accentColor" label="Secondary Accent" defaultValue={theme.accentColor} />
          <ColorField name="secondaryColor" label="Secondary Surface" defaultValue={theme.secondaryColor} />
          <ColorField name="backgroundColor" label="Background" defaultValue={theme.backgroundColor} />
          <ColorField name="foregroundColor" label="Text" defaultValue={theme.foregroundColor} />
          <ColorField name="mutedColor" label="Muted Text" defaultValue={theme.mutedColor} />
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
          Buttons & Radius
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="buttonStyle">Button Style</Label>
            <Select name="buttonStyle" defaultValue={theme.buttonStyle}>
              <SelectTrigger className="w-full" id="buttonStyle">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PILL">Pill</SelectItem>
                <SelectItem value="ROUNDED">Rounded</SelectItem>
                <SelectItem value="SQUARE">Square</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="borderRadius">Base Border Radius</Label>
            <Input id="borderRadius" name="borderRadius" required defaultValue={theme.borderRadius} placeholder="0.75rem" />
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
          Typography
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fontHeading">Heading Font</Label>
            <Select name="fontHeading" defaultValue={theme.fontHeading}>
              <SelectTrigger className="w-full" id="fontHeading">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HEADING_FONT_OPTIONS.map((font) => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fontBody">Body Font</Label>
            <Select name="fontBody" defaultValue={theme.fontBody}>
              <SelectTrigger className="w-full" id="fontBody">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BODY_FONT_OPTIONS.map((font) => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <SubmitButton className="bg-brand text-black hover:bg-brand/90">Save Theme</SubmitButton>
    </form>
  );
}
