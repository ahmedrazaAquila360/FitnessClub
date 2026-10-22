import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { AboutSection } from "@/components/sections/about-section";
import { StatsSection } from "@/components/sections/stats-section";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";
import { TrainersSection } from "@/components/trainers/trainers-section";
import { CTASection } from "@/components/sections/cta-section";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The story, mission and values behind Apex Athletic — and the coaches and community that make it work.",
};

export const revalidate = 300;

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="BUILT BY ATHLETES, FOR ATHLETES"
        description="Our story, our mission and the people who make Apex Athletic more than just a gym."
      />
      <AboutSection />
      <StatsSection />
      <WhyChooseUsSection />
      <TrainersSection />
      <CTASection />
    </>
  );
}
