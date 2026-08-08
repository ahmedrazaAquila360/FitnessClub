import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TransformationForm } from "@/components/admin/transformations/transformation-form";
import { updateTransformation } from "@/lib/actions/transformations";

export default async function EditTransformationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const transformation = await prisma.transformation.findUnique({ where: { id } });
  if (!transformation) notFound();

  return (
    <div>
      <AdminPageHeader title={`Edit ${transformation.memberName}`} backHref="/admin/transformations" />
      <TransformationForm action={updateTransformation.bind(null, id)} transformation={transformation} />
    </div>
  );
}
