import { getGymSettings } from "@/lib/data/settings";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BrandingForm } from "@/components/admin/settings/branding-form";

export const dynamic = "force-dynamic";

export default async function AdminBrandingPage() {
  const gym = await getGymSettings();

  return (
    <div>
      <AdminPageHeader title="Branding" description="Your gym's identity and contact details." />
      <BrandingForm gym={gym} />
    </div>
  );
}
