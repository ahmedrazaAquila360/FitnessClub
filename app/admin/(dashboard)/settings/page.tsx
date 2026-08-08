import { getFooterSettings } from "@/lib/data/settings";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FooterForm } from "@/components/admin/settings/footer-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const footer = await getFooterSettings();

  return (
    <div>
      <AdminPageHeader title="Settings" description="Footer content and general site preferences." />
      <FooterForm footer={footer} />
    </div>
  );
}
