"use client";

import { useActionState, useEffect, useRef } from "react";
import { subscribeNewsletter } from "@/lib/actions/newsletter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

export function NewsletterForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(subscribeNewsletter, {});

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      toast.success("You're on the list. Welcome to the team.");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex w-full max-w-sm gap-2">
      <Input
        type="email"
        name="email"
        required
        placeholder="you@email.com"
        className="h-11 rounded-full border-white/15 bg-white/5"
      />
      <Button
        type="submit"
        disabled={isPending}
        size="icon"
        className="h-11 w-11 shrink-0 rounded-full bg-brand text-black hover:bg-brand/90"
        aria-label="Subscribe"
      >
        {state.success ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
      </Button>
    </form>
  );
}
