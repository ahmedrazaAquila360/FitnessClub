import { getWhyChooseUsItems } from "@/lib/data/content";
import { Reveal } from "@/components/animations/reveal";
import { WhyChooseUsList } from "@/components/sections/why-choose-us-list";

export async function WhyChooseUsSection() {
  const items = await getWhyChooseUsItems();
  if (items.length === 0) return null;

  return (
    <section id="why-choose-us" className="relative bg-[#080808] py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              Why Apex Athletic
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="heading-font mt-4 text-4xl leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
              THE DIFFERENCE IS IN THE DETAILS
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <WhyChooseUsList items={items} />
        </Reveal>
      </div>
    </section>
  );
}
