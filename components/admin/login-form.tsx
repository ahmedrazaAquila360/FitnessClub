"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, {});

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="admin@apexathletic.com"
          className="border-white/15 bg-white/5"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="border-white/15 bg-white/5"
        />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        size="lg"
        className="w-full gap-2 rounded-full bg-brand font-semibold text-black hover:bg-brand/90"
      >
        {isPending ? "Signing in..." : "Sign In"}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
