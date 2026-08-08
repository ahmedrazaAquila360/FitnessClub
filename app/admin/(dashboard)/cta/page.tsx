import { getCTASection } from "@/lib/data/content";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CTAEditorForm } from "@/components/admin/cta/cta-editor-form";

export const dynamic = "force-dynamic";

export default async function AdminCTAPage() {
  const cta = await getCTASection();

  return (
    <div>
      <AdminPageHeader title="Final CTA" description="The last push before visitors leave your site." />
      <CTAEditorForm cta={cta} />
    </div>
  );
}
