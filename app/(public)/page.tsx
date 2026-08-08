import type { ComponentType } from "react";
import { getPageSections } from "@/lib/data/settings";
import { StructuredData } from "@/components/layout/structured-data";
import { Hero } from "@/components/hero/hero";
import { StatsSection } from "@/components/sections/stats-section";
import { AboutSection } from "@/components/sections/about-section";
import { ProgramsSection } from "@/components/programs/programs-section";
import { MembershipSection } from "@/components/memberships/membership-section";
import { TrainersSection } from "@/components/trainers/trainers-section";
import { ScheduleSection } from "@/components/schedule/schedule-section";
import { FacilitiesSection } from "@/components/facilities/facilities-section";
import { TransformationsSection } from "@/components/transformations/transformations-section";
import { TestimonialsSection } from "@/components/testimonials/testimonials-section";
import { GallerySection } from "@/components/gallery/gallery-section";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";
import { CTASection } from "@/components/sections/cta-section";
import { ContactSection } from "@/components/sections/contact-section";

export const revalidate = 120;

const SECTION_COMPONENTS: Record<string, ComponentType> = {
  hero: Hero,
  stats: StatsSection,
  about: AboutSection,
  programs: ProgramsSection,
  memberships: MembershipSection,
  trainers: TrainersSection,
  schedule: ScheduleSection,
  facilities: FacilitiesSection,
  transformations: TransformationsSection,
  testimonials: TestimonialsSection,
  gallery: GallerySection,
  "why-choose-us": WhyChooseUsSection,
  cta: CTASection,
  contact: ContactSection,
};

export default async function HomePage() {
  const sections = await getPageSections();

  return (
    <>
      <StructuredData />
      {sections
        .filter((section) => section.isEnabled)
        .map((section) => {
          const Component = SECTION_COMPONENTS[section.key];
          if (!Component) return null;
          return <Component key={section.id} />;
        })}
    </>
  );
}
