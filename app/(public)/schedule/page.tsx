import type { Metadata } from "next";
import { getClassSchedule, getTrainers, getPrograms } from "@/lib/data/content";
import { PageHeader } from "@/components/layout/page-header";
import { ScheduleExplorer } from "@/components/schedule/schedule-explorer";

export const metadata: Metadata = {
  title: "Class Schedule",
  description: "Browse and filter every class at Apex Athletic by day, trainer, program and difficulty.",
};

export const revalidate = 120;

export default async function SchedulePage() {
  const [classes, trainers, programs] = await Promise.all([
    getClassSchedule(),
    getTrainers(),
    getPrograms(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Class Schedule"
        title="PLAN YOUR WEEK"
        description="Filter by day, coach, program or difficulty to build a training week that fits your life."
      />
      <section className="bg-background pb-28 pt-8 sm:pb-36">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <ScheduleExplorer
            classes={classes}
            trainers={trainers.map((t) => ({ slug: t.slug, name: t.name }))}
            programs={programs.map((p) => ({ slug: p.slug, name: p.name }))}
          />
        </div>
      </section>
    </>
  );
}
