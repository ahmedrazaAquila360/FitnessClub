import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TrainerForm } from "@/components/admin/trainers/trainer-form";
import { updateTrainer } from "@/lib/actions/trainers";

export default async function EditTrainerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trainer = await prisma.trainer.findUnique({ where: { id } });
  if (!trainer) notFound();

  return (
    <div>
      <AdminPageHeader title={`Edit ${trainer.name}`} backHref="/admin/trainers" />
      <TrainerForm action={updateTrainer.bind(null, id)} trainer={trainer} />
    </div>
  );
}
