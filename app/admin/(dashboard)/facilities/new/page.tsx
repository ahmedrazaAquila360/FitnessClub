import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FacilityForm } from "@/components/admin/facilities/facility-form";
import { createFacility } from "@/lib/actions/facilities";

export default function NewFacilityPage() {
  return (
    <div>
      <AdminPageHeader title="New Facility" backHref="/admin/facilities" />
      <FacilityForm action={createFacility} />
    </div>
  );
}
