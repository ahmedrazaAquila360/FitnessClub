import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProgramForm } from "@/components/admin/programs/program-form";
import { updateProgram } from "@/lib/actions/programs";

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [program, trainers] = await Promise.all([
    prisma.program.findUnique({ where: { id } }),
    prisma.trainer.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);
  if (!program) notFound();

  return (
    <div>
      <AdminPageHeader title={`Edit ${program.name}`} backHref="/admin/programs" />
      <ProgramForm action={updateProgram.bind(null, id)} program={program} trainers={trainers} />
    </div>
  );
}
