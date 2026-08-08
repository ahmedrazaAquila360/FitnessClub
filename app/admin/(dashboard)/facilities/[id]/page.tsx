import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FacilityForm } from "@/components/admin/facilities/facility-form";
import { updateFacility } from "@/lib/actions/facilities";

export default async function EditFacilityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const facility = await prisma.facility.findUnique({ where: { id } });
  if (!facility) notFound();

  return (
    <div>
      <AdminPageHeader title={`Edit ${facility.name}`} backHref="/admin/facilities" />
      <FacilityForm action={updateFacility.bind(null, id)} facility={facility} />
    </div>
  );
}
