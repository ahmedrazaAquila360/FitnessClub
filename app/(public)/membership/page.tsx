import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { MembershipGrid } from "@/components/memberships/membership-grid";
import { FAQAccordion } from "@/components/sections/faq-accordion";

export const metadata: Metadata = {
  title: "Membership Plans",
  description:
    "Transparent, no-contract membership pricing at Apex Athletic. Find the plan that matches your goals.",
};

export const revalidate = 300;

export default function MembershipPage() {
  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="INVEST IN YOUR RESULTS"
        description="No hidden fees. No long-term traps. Just transparent pricing and a team invested in your progress."
      />
      <section className="bg-background pb-28 pt-8 sm:pb-36">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <MembershipGrid />
        </div>
      </section>
      <FAQAccordion />
    </>
  );
}
