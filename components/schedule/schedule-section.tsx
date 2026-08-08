import { getClassSchedule, getTrainers, getPrograms } from "@/lib/data/content";
import { Reveal } from "@/components/animations/reveal";
import { ScheduleExplorer } from "@/components/schedule/schedule-explorer";

export async function ScheduleSection() {
  const [classes, trainers, programs] = await Promise.all([
    getClassSchedule(),
    getTrainers(),
    getPrograms(),
  ]);
  if (classes.length === 0) return null;

  return (
    <section id="schedule" className="relative bg-[#080808] py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              Class Schedule
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="heading-font mt-4 text-4xl leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
              PLAN YOUR WEEK
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <ScheduleExplorer
            classes={classes}
            trainers={trainers.map((t) => ({ slug: t.slug, name: t.name }))}
            programs={programs.map((p) => ({ slug: p.slug, name: p.name }))}
          />
        </Reveal>
      </div>
    </section>
  );
}
