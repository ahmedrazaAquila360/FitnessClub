import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, ArrowRight, CalendarDays } from "lucide-react";
import { getTrainerBySlug } from "@/lib/data/content";
import { DAY_LABELS } from "@/lib/constants";
import { Reveal } from "@/components/animations/reveal";
import {
  InstagramIcon,
  XIcon,
  FacebookIcon,
  YoutubeIcon,
} from "@/components/icons/social-icons";

// Rendered fully per-request (not ISR) so a missing slug's notFound() call
// reliably commits a real 404 status instead of an optimistic static shell.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trainer = await getTrainerBySlug(slug);
  if (!trainer) return {};
  return {
    title: trainer.name,
    description: trainer.bio,
    openGraph: { images: [trainer.image] },
  };
}

export default async function TrainerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trainer = await getTrainerBySlug(slug);
  if (!trainer) notFound();

  const socials = [
    { icon: InstagramIcon, href: trainer.instagram, label: "Instagram" },
    { icon: XIcon, href: trainer.twitter, label: "X" },
    { icon: FacebookIcon, href: trainer.facebook, label: "Facebook" },
    { icon: YoutubeIcon, href: trainer.youtube, label: "YouTube" },
  ].filter((s): s is { icon: typeof InstagramIcon; href: string; label: string } =>
    Boolean(s.href)
  );

  return (
    <section className="bg-background pb-28 pt-32 sm:pt-40">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <div className="relative aspect-3/4 w-full overflow-hidden rounded-3xl">
              <Image src={trainer.image} alt={trainer.name} fill sizes="(max-width: 1024px) 100vw, 500px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            {socials.length > 0 && (
              <div className="mt-6 flex gap-3">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-foreground/70 transition-colors hover:border-brand hover:text-brand"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </Reveal>

          <div>
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                {trainer.position}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="heading-font mt-3 text-5xl leading-[0.95] tracking-tight sm:text-6xl">
                {trainer.name}
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-5 flex flex-wrap gap-2">
                {trainer.specialization.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-wide text-foreground/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/70">
                {trainer.bio}
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:max-w-md">
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="heading-font text-3xl text-brand">{trainer.experienceYears}+</p>
                  <p className="text-xs uppercase tracking-wide text-foreground/50">
                    Years Experience
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="heading-font text-3xl text-brand">{trainer.programs.length}</p>
                  <p className="text-xs uppercase tracking-wide text-foreground/50">
                    Programs Led
                  </p>
                </div>
              </div>
            </Reveal>

            {trainer.certifications.length > 0 && (
              <Reveal delay={0.3}>
                <div className="mt-8">
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40">
                    Certifications
                  </h2>
                  <ul className="space-y-2">
                    {trainer.certifications.map((cert) => (
                      <li key={cert} className="flex items-center gap-2.5 text-sm text-foreground/70">
                        <Award className="h-4 w-4 text-brand" />
                        {cert}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {trainer.programs.length > 0 && (
              <Reveal delay={0.35}>
                <div className="mt-8">
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40">
                    Programs
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {trainer.programs.map((program) => (
                      <Link
                        key={program.id}
                        href={`/programs/${program.slug}`}
                        className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-foreground/70 transition-colors hover:border-brand hover:text-brand"
                      >
                        {program.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {trainer.classes.length > 0 && (
              <Reveal delay={0.4}>
                <div className="mt-8">
                  <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40">
                    <CalendarDays className="h-3.5 w-3.5" /> Class Schedule
                  </h2>
                  <div className="divide-y divide-white/10 rounded-2xl border border-white/10">
                    {trainer.classes.map((c) => (
                      <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm">
                        <span className="font-medium">{c.className}</span>
                        <span className="text-foreground/50">{DAY_LABELS[c.dayOfWeek]}</span>
                        <span className="text-foreground/50">{c.startTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            <Reveal delay={0.45}>
              <Link
                href="/membership"
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-transform hover:scale-[1.02]"
              >
                Train With {trainer.name.split(" ")[0]}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
