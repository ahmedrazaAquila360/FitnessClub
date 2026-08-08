import { getFAQs } from "@/lib/data/content";
import { Reveal } from "@/components/animations/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export async function FAQAccordion() {
  const faqs = await getFAQs();
  if (faqs.length === 0) return null;

  return (
    <section className="border-t border-white/10 bg-[#080808] py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <Reveal className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            FAQ
          </span>
          <h2 className="heading-font mt-4 text-3xl tracking-tight sm:text-4xl">
            QUESTIONS, ANSWERED
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Accordion className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-white/10">
                <AccordionTrigger className="text-left text-base font-medium hover:text-brand">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-foreground/60">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
