import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ClassForm } from "@/components/admin/schedule/class-form";
import { updateClass } from "@/lib/actions/schedule";

export default async function EditClassPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [classItem, trainers, programs] = await Promise.all([
    prisma.classSchedule.findUnique({ where: { id } }),
    prisma.trainer.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.program.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  if (!classItem) notFound();

  return (
    <div>
      <AdminPageHeader title={`Edit ${classItem.className}`} backHref="/admin/schedule" />
      <ClassForm action={updateClass.bind(null, id)} classItem={classItem} trainers={trainers} programs={programs} />
    </div>
  );
}
