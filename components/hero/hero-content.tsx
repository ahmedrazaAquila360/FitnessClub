"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Counter } from "@/components/animations/counter";
import { useScrollScrubVideo } from "@/lib/hooks/use-scroll-scrub-video";
import type { HeroSection, Statistic } from "@prisma/client";

const EASE = [0.16, 1, 0.3, 1] as const;
const SCRUB_VIDEO_SRC = "/videos/hero-scrub.mp4";

const alignmentClasses: Record<string, string> = {
  LEFT: "items-start text-left",
  CENTER: "items-center text-center",
  RIGHT: "items-end text-right",
};

export function HeroContent({
  hero,
  highlightStat,
}: {
  hero: HeroSection;
  highlightStat: Statistic | null;
}) {
  const align = alignmentClasses[hero.textAlign] ?? alignmentClasses.LEFT;
  const isZoom = hero.animationType === "ZOOM_IN";
  const isSlideLeft = hero.animationType === "SLIDE_LEFT";
  const isFadeIn = hero.animationType === "FADE_IN";

  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  useScrollScrubVideo({ sectionRef, videoRef, fadeRef });

  const videoSrc = hero.backgroundVideo || SCRUB_VIDEO_SRC;

  const headingInitial = isZoom
    ? { opacity: 0, scale: 0.85 }
    : isSlideLeft
      ? { opacity: 0, x: -60 }
      : isFadeIn
        ? { opacity: 0 }
        : { opacity: 0, y: 40 };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-black"
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.15 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: hero.overlayOpacity }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/30" />
        <div className="noise-overlay" />
      </motion.div>

      {/* Floating ambient glow */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-brand/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-brand-accent/10 blur-[120px]" />

      <div ref={fadeRef} className="relative mx-auto flex h-full w-full max-w-7xl flex-col px-6 pt-28 sm:px-8 lg:pt-24">
        <div className={cn("flex max-w-3xl flex-col gap-6", align)}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
            className="glass inline-flex items-center gap-2 self-start rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-foreground/90"
            style={{ alignSelf: hero.textAlign === "CENTER" ? "center" : hero.textAlign === "RIGHT" ? "flex-end" : "flex-start" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
            {hero.badge}
          </motion.div>

          <h1 className="heading-font text-[13vw] leading-[0.92] tracking-tight sm:text-[9vw] lg:text-[6.2vw]">
            <motion.span
              className="block"
              initial={headingInitial}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              transition={{ delay: 0.45, duration: 0.85, ease: EASE }}
            >
              {hero.heading}
            </motion.span>
            <motion.span
              className="text-brand-gradient block"
              initial={headingInitial}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.85, ease: EASE }}
            >
              {hero.headingHighlight}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7, ease: EASE }}
            className="max-w-xl text-base leading-relaxed text-foreground/70 sm:text-lg"
          >
            {hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7, ease: EASE }}
            className="mt-2 flex flex-wrap items-center gap-4"
          >
            <Link
              href={hero.primaryCtaHref}
              data-cursor="link"
              className="group inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              {hero.primaryCtaLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={hero.secondaryCtaHref}
              data-cursor="link"
              className="glass group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-foreground transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              {hero.secondaryCtaLabel}
            </Link>
          </motion.div>
        </div>

        {highlightStat && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7, ease: EASE }}
            className="glass mt-16 hidden w-fit items-center gap-4 rounded-2xl px-6 py-4 sm:flex lg:absolute lg:right-8 lg:top-1/2 lg:mt-0 lg:-translate-y-1/2"
          >
            <div className="heading-font text-4xl text-brand">
              <Counter value={highlightStat.value} suffix={highlightStat.suffix} />
            </div>
            <div className="max-w-[8rem] text-xs uppercase leading-tight tracking-wider text-foreground/60">
              {highlightStat.label}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-foreground/50"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
