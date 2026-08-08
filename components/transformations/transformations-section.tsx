import { getTransformations } from "@/lib/data/content";
import { Reveal } from "@/components/animations/reveal";
import { BeforeAfterSlider } from "@/components/transformations/before-after-slider";

export async function TransformationsSection() {
  const transformations = await getTransformations();
  if (transformations.length === 0) return null;

  return (
    <section id="transformations" className="relative bg-background py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              Real Results
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="heading-font mt-4 text-4xl leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
              TRANSFORMATIONS THAT SPEAK
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {transformations.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.1}>
              <BeforeAfterSlider beforeImage={t.beforeImage} afterImage={t.afterImage} memberName={t.memberName} />
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <h3 className="heading-font text-xl tracking-wide">{t.memberName}</h3>
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                    {t.duration}
                  </span>
                </div>
                <p className="mt-1 text-sm text-foreground/50">Goal: {t.goal}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/65">{t.story}</p>
                <p className="mt-2 text-sm font-medium text-brand">{t.result}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
