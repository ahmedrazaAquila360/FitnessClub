import { getSEOSettings } from "@/lib/data/settings";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SEOForm } from "@/components/admin/settings/seo-form";

export const dynamic = "force-dynamic";

export default async function AdminSEOPage() {
  const seo = await getSEOSettings();

  return (
    <div>
      <AdminPageHeader title="SEO" description="Control how your site appears in search engines and social shares." />
      <SEOForm seo={seo} />
    </div>
  );
}
