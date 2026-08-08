import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { createSocialLink, updateSocialLink, deleteSocialLink } from "@/lib/actions/social";
import type { SocialLink } from "@prisma/client";

const PLATFORMS = ["INSTAGRAM", "FACEBOOK", "TWITTER", "YOUTUBE", "TIKTOK", "LINKEDIN", "WHATSAPP"];

export function SocialLinksManager({ links }: { links: SocialLink[] }) {
  return (
    <div className="space-y-3">
      {links.map((link) => (
        <form
          key={link.id}
          action={async (formData: FormData) => {
            "use server";
            await updateSocialLink(link.id, {}, formData);
          }}
          className="grid grid-cols-2 items-end gap-2 rounded-xl border border-white/10 bg-white/2 p-4 sm:grid-cols-8"
        >
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs text-foreground/45">Platform</label>
            <select
              name="platform"
              defaultValue={link.platform}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2 space-y-1 sm:col-span-4">
            <label className="text-xs text-foreground/45">URL</label>
            <Input name="url" defaultValue={link.url} required />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-foreground/45">Order</label>
            <Input name="order" type="number" defaultValue={link.order} />
          </div>
          <input type="hidden" name="isActive" value="true" />
          <div className="flex gap-1">
            <Button type="submit" size="sm" variant="outline" className="flex-1">
              Save
            </Button>
            <Button
              type="submit"
              formAction={deleteSocialLink.bind(null, link.id)}
              size="icon"
              variant="ghost"
              className="text-foreground/50 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </form>
      ))}

      <form
        action={async (formData: FormData) => {
          "use server";
          await createSocialLink({}, formData);
        }}
        className="grid grid-cols-2 items-end gap-2 rounded-xl border border-dashed border-white/15 p-4 sm:grid-cols-8"
      >
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs text-foreground/45">Platform</label>
          <select name="platform" defaultValue="INSTAGRAM" className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm">
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2 space-y-1 sm:col-span-4">
          <label className="text-xs text-foreground/45">URL</label>
          <Input name="url" required placeholder="https://instagram.com/yourgym" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-foreground/45">Order</label>
          <Input name="order" type="number" defaultValue={links.length} />
        </div>
        <input type="hidden" name="isActive" value="true" />
        <Button type="submit" size="sm" className="gap-1.5 bg-brand text-black hover:bg-brand/90">
          <Plus className="h-3.5 w-3.5" /> Add
        </Button>
      </form>
    </div>
  );
}
