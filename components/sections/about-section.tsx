import { getAbout } from "@/lib/data/content";
import { Reveal } from "@/components/animations/reveal";
import { AboutImages } from "@/components/sections/about-images";

type ValueItem = { title: string; description: string };

export async function AboutSection() {
  const about = await getAbout();
  if (!about.isActive) return null;
  const values = Array.isArray(about.values) ? (about.values as ValueItem[]) : [];

  return (
    <section id="about" className="relative overflow-hidden bg-background py-28 sm:py-36">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 sm:px-8 lg:grid-cols-2 lg:gap-12">
        <AboutImages image={about.image} secondaryImage={about.secondaryImage} />

        <div className="flex flex-col justify-center">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              {about.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="heading-font mt-4 text-4xl leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
              {about.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/65 sm:text-lg">
              {about.description}
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="relative mt-8 max-w-xl rounded-2xl border border-white/10 bg-white/3 p-6">
              <p className="heading-font mb-1 text-sm uppercase tracking-widest text-brand">
                {about.missionTitle}
              </p>
              <p className="text-sm leading-relaxed text-foreground/70">{about.missionText}</p>
            </div>
          </Reveal>

          {values.length > 0 && (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {values.map((value, i) => (
                <Reveal key={value.title} delay={0.35 + i * 0.08}>
                  <div className="border-t border-white/10 pt-4">
                    <span className="heading-font text-2xl text-foreground/25">
                      0{i + 1}
                    </span>
                    <h3 className="mt-2 text-sm font-semibold uppercase tracking-wide">
                      {value.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/55">
                      {value.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
