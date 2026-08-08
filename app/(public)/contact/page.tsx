import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ContactSection } from "@/components/sections/contact-section";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Apex Athletic — book a tour, ask a question, or start your membership.",
};

export const revalidate = 300;

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get In Touch"
        title="LET'S START YOUR JOURNEY"
        description="Questions about programs, pricing or a tour? Our team responds fast."
      />
      <div className="-mt-16">
        <ContactSection showHeading={false} />
      </div>
    </>
  );
}
