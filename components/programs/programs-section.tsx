import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPrograms } from "@/lib/data/content";
import { ProgramCard } from "@/components/programs/program-card";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";

export async function ProgramsSection() {
  const programs = await getPrograms();
  if (programs.length === 0) return null;
  const featured = programs.slice(0, 8);

  return (
    <section id="programs" className="relative bg-background py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mb-14 flex flex-col items-end justify-between gap-6 sm:flex-row">
          <div>
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                Training Programs
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="heading-font mt-4 max-w-xl text-4xl leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
                FIND YOUR DISCIPLINE
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <Link
              href="/programs"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors hover:border-brand hover:text-brand"
            >
              View All Programs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
          {featured.map((program) => (
            <StaggerItem key={program.id}>
              <ProgramCard program={program} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
