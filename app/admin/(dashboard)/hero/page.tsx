import { getHero } from "@/lib/data/content";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { HeroEditorForm } from "@/components/admin/hero/hero-editor-form";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const hero = await getHero();

  return (
    <div>
      <AdminPageHeader title="Hero Section" description="The first thing every visitor sees." />
      <HeroEditorForm hero={hero} />
    </div>
  );
}
