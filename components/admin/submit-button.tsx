"use client";

import { useFormStatus } from "react-dom";
import { Button, type buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export function SubmitButton({
  children,
  pendingLabel = "Saving...",
  className,
  variant,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      variant={variant}
      className={cn("rounded-full font-bold uppercase tracking-wider", className)}
    >
      {pending ? pendingLabel : children}
    </Button>
  );
}
