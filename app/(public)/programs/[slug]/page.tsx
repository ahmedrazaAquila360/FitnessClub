import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Gauge, Layers, User } from "lucide-react";
import { getProgramBySlug, getPrograms } from "@/lib/data/content";
import { getIcon } from "@/lib/icon-map";
import { DAY_LABELS, DIFFICULTY_LABELS } from "@/lib/constants";
import { Reveal } from "@/components/animations/reveal";
import { ProgramCard } from "@/components/programs/program-card";

export const revalidate = 300;

export async function generateStaticParams() {
  const programs = await getPrograms();
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return {};
  return {
    title: program.name,
    description: program.shortDescription,
    openGraph: { images: [program.image] },
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) notFound();

  const allPrograms = await getPrograms();
  const related = allPrograms.filter((p) => p.id !== program.id).slice(0, 3);
  // getIcon resolves to a stable Lucide component reference from a static map.
  const Icon = getIcon(program.icon);

  return (
    <>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-black pt-32">
        <Image
          src={program.image}
          alt={program.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-16 sm:px-8">
          <Reveal>
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur">
              {/* eslint-disable-next-line react-hooks/static-components -- Icon is a stable reference from a static lookup map */}
              <Icon className="h-5 w-5 text-brand" />
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              {program.category}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <h1 className="heading-font max-w-3xl text-5xl leading-[0.95] tracking-tight sm:text-7xl">
              {program.name}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 sm:px-8 lg:grid-cols-[2fr_1fr]">
          <div>
            <Reveal>
              <p className="text-lg leading-relaxed text-foreground/70">{program.description}</p>
            </Reveal>

            {program.classes.length > 0 && (
              <Reveal delay={0.15} className="mt-12">
                <h2 className="heading-font mb-5 text-2xl tracking-wide">Where to find it</h2>
                <div className="divide-y divide-white/10 rounded-2xl border border-white/10">
                  {program.classes.map((c) => (
                    <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm">
                      <span className="font-medium">{DAY_LABELS[c.dayOfWeek]}</span>
                      <span className="text-foreground/60">
                        {c.startTime} – {c.endTime}
                      </span>
                      <span className="text-foreground/60">{c.room}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          <Reveal delay={0.1}>
            <div className="glass rounded-2xl p-6">
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40">
                Program Details
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-brand" />
                  <span className="text-foreground/70">Duration: {program.duration}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Gauge className="h-4 w-4 text-brand" />
                  <span className="text-foreground/70">
                    {DIFFICULTY_LABELS[program.difficulty] ?? program.difficulty}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Layers className="h-4 w-4 text-brand" />
                  <span className="text-foreground/70">{program.category}</span>
                </li>
                {program.trainer && (
                  <li className="flex items-center gap-3">
                    <User className="h-4 w-4 text-brand" />
                    <Link href={`/trainers/${program.trainer.slug}`} className="text-foreground/70 hover:text-brand">
                      Coached by {program.trainer.name}
                    </Link>
                  </li>
                )}
              </ul>
              <Link
                href={program.ctaHref || "/membership"}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-transform hover:scale-[1.02]"
              >
                {program.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>

        {related.length > 0 && (
          <div className="mx-auto mt-24 max-w-7xl px-6 sm:px-8">
            <Reveal>
              <h2 className="heading-font mb-8 text-2xl tracking-wide">More Programs</h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {related.map((p) => (
                <ProgramCard key={p.id} program={p} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
