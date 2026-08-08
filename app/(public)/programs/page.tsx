import type { Metadata } from "next";
import { getPrograms } from "@/lib/data/content";
import { ProgramCard } from "@/components/programs/program-card";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Training Programs",
  description:
    "Explore every training program at Apex Athletic — strength, conditioning, boxing, mobility and more, led by elite coaches.",
};

export const revalidate = 300;

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <>
      <PageHeader
        eyebrow="Training Programs"
        title="EVERY PATH TO YOUR STRONGEST SELF"
        description="From raw strength to explosive conditioning, every program is coached, measured and built to get real results."
      />
      <section className="bg-background pb-28 pt-8 sm:pb-36">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          {programs.length === 0 ? (
            <Reveal>
              <p className="text-center text-foreground/50">
                Programs are being updated. Check back soon.
              </p>
            </Reveal>
          ) : (
            <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.06}>
              {programs.map((program) => (
                <StaggerItem key={program.id}>
                  <ProgramCard program={program} />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>
    </>
  );
}
