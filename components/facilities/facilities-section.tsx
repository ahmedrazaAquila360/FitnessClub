import Image from "next/image";
import { getFacilities } from "@/lib/data/content";
import { getIcon } from "@/lib/icon-map";
import { Reveal } from "@/components/animations/reveal";
import { cn } from "@/lib/utils";

const SPAN_PATTERN = [
  "sm:col-span-4 sm:row-span-2",
  "sm:col-span-2 sm:row-span-1",
  "sm:col-span-2 sm:row-span-1",
  "sm:col-span-3 sm:row-span-1",
  "sm:col-span-3 sm:row-span-1",
  "sm:col-span-2 sm:row-span-2",
  "sm:col-span-4 sm:row-span-1",
];

export async function FacilitiesSection() {
  const facilities = await getFacilities();
  if (facilities.length === 0) return null;

  return (
    <section id="facilities" className="relative bg-background py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              The Facility
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="heading-font mt-4 text-4xl leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
              BUILT FOR PERFORMANCE
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:auto-rows-[220px] sm:grid-cols-6">
          {facilities.map((facility, i) => {
            const Icon = getIcon(facility.icon);
            const span = SPAN_PATTERN[i % SPAN_PATTERN.length];
            return (
              <Reveal
                key={facility.id}
                delay={(i % SPAN_PATTERN.length) * 0.06}
                className={cn("group relative h-[280px] overflow-hidden rounded-3xl sm:h-auto", span)}
              >
                <Image
                  src={facility.image}
                  alt={facility.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 transition-colors duration-500 group-hover:via-black/60" />
                <div className="relative flex h-full flex-col justify-end p-6">
                  <Icon className="mb-3 h-6 w-6 text-brand" strokeWidth={1.75} />
                  <h3 className="heading-font text-xl tracking-wide sm:text-2xl">{facility.name}</h3>
                  <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-foreground/70">
                    {facility.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
