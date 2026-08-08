import { getAbout, getStatistics } from "@/lib/data/content";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AboutForm } from "@/components/admin/about/about-form";
import { StatisticsManager } from "@/components/admin/about/statistics-manager";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const [about, statistics] = await Promise.all([getAbout(), getStatistics()]);

  return (
    <div className="space-y-12">
      <div>
        <AdminPageHeader title="About Section" description="Your gym's story, mission and values." />
        <AboutForm about={about} />
      </div>

      <div>
        <h2 className="heading-font mb-1 text-xl tracking-wide">Statistics</h2>
        <p className="mb-5 text-sm text-foreground/50">
          Shown in the trust bar and floating hero counter.
        </p>
        <div className="max-w-3xl">
          <StatisticsManager statistics={statistics} />
        </div>
      </div>
    </div>
  );
}
