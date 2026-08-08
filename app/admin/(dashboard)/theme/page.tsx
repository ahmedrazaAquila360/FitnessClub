import { getThemeSettings } from "@/lib/data/settings";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ThemeForm } from "@/components/admin/settings/theme-form";

export const dynamic = "force-dynamic";

export default async function AdminThemePage() {
  const theme = await getThemeSettings();

  return (
    <div>
      <AdminPageHeader
        title="Theme"
        description="Colors, typography and button style — applied site-wide instantly."
      />
      <ThemeForm theme={theme} />
    </div>
  );
}
