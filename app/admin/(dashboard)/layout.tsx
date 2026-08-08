import { requireUser } from "@/lib/auth/guards";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireUser();

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar role={session.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar name={session.name} role={session.role} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
