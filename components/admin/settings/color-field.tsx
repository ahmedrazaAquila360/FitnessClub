"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ColorField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={/^#([0-9a-fA-F]{6})$/.test(value) ? value : "#000000"}
          onChange={(e) => setValue(e.target.value)}
          className="h-9 w-11 shrink-0 cursor-pointer rounded-lg border border-input bg-transparent p-1"
          aria-label={`${label} color picker`}
        />
        <Input
          id={name}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          pattern="^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$"
        />
      </div>
    </div>
  );
}
