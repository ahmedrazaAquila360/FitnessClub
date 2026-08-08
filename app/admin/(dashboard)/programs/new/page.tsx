import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProgramForm } from "@/components/admin/programs/program-form";
import { createProgram } from "@/lib/actions/programs";

export default async function NewProgramPage() {
  const trainers = await prisma.trainer.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <AdminPageHeader title="New Program" backHref="/admin/programs" />
      <ProgramForm action={createProgram} trainers={trainers} />
    </div>
  );
}
