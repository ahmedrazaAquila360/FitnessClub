import { getStatistics } from "@/lib/data/content";
import { getIcon } from "@/lib/icon-map";
import { Counter } from "@/components/animations/counter";
import { Reveal } from "@/components/animations/reveal";

export async function StatsSection() {
  const stats = await getStatistics();
  if (stats.length === 0) return null;

  return (
    <section id="stats" className="relative border-y border-white/10 bg-[#080808] py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 sm:px-8 md:grid-cols-4 md:gap-4">
        {stats.map((stat, i) => {
          const Icon = getIcon(stat.icon);
          return (
            <Reveal key={stat.id} delay={i * 0.08} className="relative">
              <div className="flex flex-col items-center gap-2 text-center md:border-l md:border-white/10 md:first:border-l-0">
                <Icon className="mb-1 h-5 w-5 text-brand" strokeWidth={1.75} />
                <div className="heading-font text-4xl sm:text-5xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
