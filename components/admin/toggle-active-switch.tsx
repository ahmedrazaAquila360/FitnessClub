"use client";

import { useTransition } from "react";
import { Switch } from "@/components/ui/switch";

export function ToggleActiveSwitch({
  id,
  isActive,
  onToggle,
}: {
  id: string;
  isActive: boolean;
  onToggle: (id: string, next: boolean) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Switch
      checked={isActive}
      disabled={isPending}
      onCheckedChange={(checked) => startTransition(() => onToggle(id, checked))}
      aria-label={isActive ? "Deactivate" : "Activate"}
    />
  );
}
