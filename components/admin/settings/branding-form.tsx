"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/admin/submit-button";
import { ImagePicker } from "@/components/admin/media/image-picker";
import { updateGymSettings } from "@/lib/actions/settings";
import type { GymSettings } from "@prisma/client";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

export function BrandingForm({ gym }: { gym: GymSettings }) {
  const [state, formAction] = useActionState(updateGymSettings, {});
  const [logoUrl, setLogoUrl] = useState(gym.logoUrl ?? "");
  const [faviconUrl, setFaviconUrl] = useState(gym.faviconUrl ?? "");
  const hours = gym.openingHours as Record<string, string>;

  useEffect(() => {
    if (state.success) toast.success("Branding updated");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="max-w-3xl space-y-8">
      <section className="space-y-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
          Brand Identity
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name</Label>
            <Input id="brandName" name="brandName" required defaultValue={gym.brandName} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input id="tagline" name="tagline" required defaultValue={gym.tagline} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <ImagePicker label="Logo" name="logoUrl" value={logoUrl} onChange={setLogoUrl} folder="branding" required={false} />
          <ImagePicker label="Favicon" name="faviconUrl" value={faviconUrl} onChange={setFaviconUrl} folder="branding" required={false} />
        </div>
        <input type="hidden" name="logoDarkUrl" value={gym.logoDarkUrl ?? ""} />
        <input type="hidden" name="logoLightUrl" value={gym.logoLightUrl ?? ""} />
      </section>

      <section className="space-y-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" required defaultValue={gym.phone} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" name="whatsapp" required defaultValue={gym.whatsapp} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required defaultValue={gym.email} />
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
          Location
        </h2>
        <div className="space-y-2">
          <Label htmlFor="address">Street Address</Label>
          <Input id="address" name="address" required defaultValue={gym.address} />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" required defaultValue={gym.city} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" name="state" required defaultValue={gym.state} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zip">Zip</Label>
            <Input id="zip" name="zip" required defaultValue={gym.zip} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" required defaultValue={gym.country} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input id="latitude" name="latitude" type="number" step="0.0001" required defaultValue={gym.latitude} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input id="longitude" name="longitude" type="number" step="0.0001" required defaultValue={gym.longitude} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="googleMapsEmbed">Google Maps Embed URL (optional)</Label>
          <Input id="googleMapsEmbed" name="googleMapsEmbed" defaultValue={gym.googleMapsEmbed ?? ""} />
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
          Opening Hours
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DAYS.map((day) => (
            <div key={day} className="space-y-2">
              <Label htmlFor={day} className="capitalize">
                {day}
              </Label>
              <Input id={day} name={day} required defaultValue={hours[day]} />
            </div>
          ))}
        </div>
      </section>

      <SubmitButton className="bg-brand text-black hover:bg-brand/90">Save Branding</SubmitButton>
    </form>
  );
}
