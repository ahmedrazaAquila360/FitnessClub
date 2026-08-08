import type { Metadata } from "next";
import { Dumbbell } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-black">
            <Dumbbell className="h-6 w-6" strokeWidth={2.5} />
          </span>
          <h1 className="heading-font text-2xl tracking-wide">APEX ADMIN</h1>
          <p className="mt-1 text-sm text-foreground/50">Sign in to manage your gym website</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/2 p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
