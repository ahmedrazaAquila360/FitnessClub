import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { createNavItem, updateNavItem, deleteNavItem } from "@/lib/actions/navigation";
import type { NavigationItem, NavLocation } from "@prisma/client";

export function NavItemsManager({
  items,
  location,
}: {
  items: NavigationItem[];
  location: NavLocation;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <form
          key={item.id}
          action={async (formData: FormData) => {
            "use server";
            await updateNavItem(item.id, {}, formData);
          }}
          className="grid grid-cols-2 items-end gap-2 rounded-xl border border-white/10 bg-white/2 p-4 sm:grid-cols-12"
        >
          <input type="hidden" name="location" value={location} />
          <div className="col-span-2 space-y-1 sm:col-span-3">
            <label className="text-xs text-foreground/45">Label</label>
            <Input name="label" defaultValue={item.label} required />
          </div>
          <div className="col-span-2 space-y-1 sm:col-span-4">
            <label className="text-xs text-foreground/45">Link</label>
            <Input name="href" defaultValue={item.href} required />
          </div>
          <div className="space-y-1 sm:col-span-1">
            <label className="text-xs text-foreground/45">Order</label>
            <Input name="order" type="number" defaultValue={item.order} />
          </div>
          <label className="flex items-center gap-1.5 pb-2 text-xs sm:col-span-2">
            <Switch name="isExternal" defaultChecked={item.isExternal} /> External
          </label>
          <label className="flex items-center gap-1.5 pb-2 text-xs sm:col-span-1">
            <Switch name="isActive" defaultChecked={item.isActive} /> On
          </label>
          <div className="flex gap-1 sm:col-span-1">
            <Button type="submit" size="sm" variant="outline" className="flex-1">
              Save
            </Button>
            <Button
              type="submit"
              formAction={deleteNavItem.bind(null, item.id)}
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
          await createNavItem({}, formData);
        }}
        className="grid grid-cols-2 items-end gap-2 rounded-xl border border-dashed border-white/15 p-4 sm:grid-cols-12"
      >
        <input type="hidden" name="location" value={location} />
        <div className="col-span-2 space-y-1 sm:col-span-3">
          <label className="text-xs text-foreground/45">Label</label>
          <Input name="label" required placeholder="Programs" />
        </div>
        <div className="col-span-2 space-y-1 sm:col-span-4">
          <label className="text-xs text-foreground/45">Link</label>
          <Input name="href" required placeholder="/programs" />
        </div>
        <div className="space-y-1 sm:col-span-1">
          <label className="text-xs text-foreground/45">Order</label>
          <Input name="order" type="number" defaultValue={items.length} />
        </div>
        <input type="hidden" name="isExternal" value="" />
        <input type="hidden" name="isActive" value="true" />
        <div className="sm:col-span-4" />
        <Button type="submit" size="sm" className="gap-1.5 bg-brand text-black hover:bg-brand/90 sm:col-span-1">
          <Plus className="h-3.5 w-3.5" /> Add
        </Button>
      </form>
    </div>
  );
}
