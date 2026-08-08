import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ClassForm } from "@/components/admin/schedule/class-form";
import { createClass } from "@/lib/actions/schedule";

export default async function NewClassPage() {
  const [trainers, programs] = await Promise.all([
    prisma.trainer.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.program.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <AdminPageHeader title="New Class" backHref="/admin/schedule" />
      <ClassForm action={createClass} trainers={trainers} programs={programs} />
    </div>
  );
}
