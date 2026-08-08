import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { getCTASection } from "@/lib/data/content";
import { Reveal } from "@/components/animations/reveal";
import { ParallaxImage } from "@/components/animations/parallax";
import Image from "next/image";

export async function CTASection() {
  const cta = await getCTASection();
  if (!cta.isActive) return null;

  return (
    <section id="cta" className="relative overflow-hidden bg-black py-36 sm:py-48">
      <ParallaxImage className="absolute inset-0" strength={60}>
        <Image src={cta.backgroundImage} alt="" fill sizes="100vw" className="object-cover" />
      </ParallaxImage>
      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
      <div className="noise-overlay" />

      <div className="relative mx-auto max-w-4xl px-6 text-center sm:px-8">
        <Reveal>
          <h2 className="heading-font text-5xl leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl">
            {cta.heading}
            <span className="text-brand-gradient block">{cta.headingHighlight}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-foreground/70 sm:text-lg">
            {cta.description}
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={cta.primaryCtaHref}
              className="group inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-sm font-bold uppercase tracking-wider text-black transition-transform hover:scale-[1.03]"
            >
              {cta.primaryCtaLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={cta.secondaryCtaHref}
              className="glass group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-wider transition-transform hover:scale-[1.03]"
            >
              <Phone className="h-3.5 w-3.5" />
              {cta.secondaryCtaLabel}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
