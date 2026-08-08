import { getPageSections } from "@/lib/data/settings";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SectionManagerClient } from "@/components/admin/homepage/section-manager-client";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  const sections = await getPageSections();

  return (
    <div>
      <AdminPageHeader
        title="Homepage Sections"
        description="Drag to reorder, toggle to show or hide. Changes apply instantly to your live homepage."
      />
      <div className="max-w-2xl">
        <SectionManagerClient sections={sections} />
      </div>
    </div>
  );
}
