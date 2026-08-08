import type { Metadata } from "next";
import { getTrainers } from "@/lib/data/content";
import { TrainerCard } from "@/components/trainers/trainer-card";
import { PageHeader } from "@/components/layout/page-header";
import { Stagger, StaggerItem } from "@/components/animations/reveal";

export const metadata: Metadata = {
  title: "Our Trainers",
  description: "Meet the certified coaches behind Apex Athletic's training programs.",
};

export const revalidate = 300;

export default async function TrainersPage() {
  const trainers = await getTrainers();

  return (
    <>
      <PageHeader
        eyebrow="Our Coaches"
        title="TRAINED BY THE BEST"
        description="Every coach at Apex Athletic is certified, experienced, and obsessed with getting you results."
      />
      <section className="bg-background pb-28 pt-8 sm:pb-36">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.06}>
            {trainers.map((trainer) => (
              <StaggerItem key={trainer.id}>
                <TrainerCard trainer={trainer} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
