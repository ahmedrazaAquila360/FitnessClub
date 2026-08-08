import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { createStatistic, updateStatistic, deleteStatistic } from "@/lib/actions/statistics";
import { ICON_NAMES } from "@/lib/icon-map";
import type { Statistic } from "@prisma/client";

export function StatisticsManager({ statistics }: { statistics: Statistic[] }) {
  return (
    <div className="space-y-3">
      {statistics.map((stat) => (
        <form
          key={stat.id}
          action={async (formData: FormData) => {
            "use server";
            await updateStatistic(stat.id, {}, formData);
          }}
          className="grid grid-cols-2 items-end gap-2 rounded-xl border border-white/10 bg-white/2 p-4 sm:grid-cols-6"
        >
          <div className="col-span-2 space-y-1 sm:col-span-2">
            <label className="text-xs text-foreground/45">Label</label>
            <Input name="label" defaultValue={stat.label} required />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-foreground/45">Value</label>
            <Input name="value" type="number" defaultValue={stat.value} required />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-foreground/45">Suffix</label>
            <Input name="suffix" defaultValue={stat.suffix} placeholder="+" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-foreground/45">Icon</label>
            <select
              name="icon"
              defaultValue={stat.icon}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
            >
              {ICON_NAMES.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </div>
          <input type="hidden" name="order" value={stat.order} />
          <input type="hidden" name="isActive" value="true" />
          <div className="flex gap-1">
            <Button type="submit" size="sm" variant="outline" className="flex-1">
              Save
            </Button>
            <Button
              type="submit"
              formAction={deleteStatistic.bind(null, stat.id)}
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
          await createStatistic({}, formData);
        }}
        className="grid grid-cols-2 items-end gap-2 rounded-xl border border-dashed border-white/15 p-4 sm:grid-cols-6"
      >
        <div className="col-span-2 space-y-1 sm:col-span-2">
          <label className="text-xs text-foreground/45">Label</label>
          <Input name="label" required placeholder="Members" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-foreground/45">Value</label>
          <Input name="value" type="number" required placeholder="2500" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-foreground/45">Suffix</label>
          <Input name="suffix" placeholder="+" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-foreground/45">Icon</label>
          <select name="icon" defaultValue="Users" className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm">
            {ICON_NAMES.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </div>
        <input type="hidden" name="order" value={statistics.length} />
        <input type="hidden" name="isActive" value="true" />
        <Button type="submit" size="sm" className="gap-1.5 bg-brand text-black hover:bg-brand/90">
          <Plus className="h-3.5 w-3.5" /> Add
        </Button>
      </form>
    </div>
  );
}
