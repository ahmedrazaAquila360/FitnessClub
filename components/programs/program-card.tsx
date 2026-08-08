import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getIcon } from "@/lib/icon-map";
import { DIFFICULTY_LABELS } from "@/lib/constants";

export function ProgramCard({
  program,
}: {
  program: {
    slug: string;
    name: string;
    shortDescription: string;
    image: string;
    icon: string;
    category: string;
    duration: string;
    difficulty: string;
  };
}) {
  // getIcon resolves to a stable Lucide component reference from a static map.
  const Icon = getIcon(program.icon);

  return (
    <Link
      href={`/programs/${program.slug}`}
      data-cursor="view"
      className="group relative flex aspect-3/4 w-full flex-col justify-end overflow-hidden rounded-3xl transition-transform duration-500 ease-out hover:-translate-y-2"
    >
      <Image
        src={program.image}
        alt={program.name}
        fill
        sizes="(max-width: 768px) 90vw, 380px"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10 opacity-90 transition-opacity duration-500 group-hover:from-black/95 group-hover:via-black/60" />
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "linear-gradient(to top, color-mix(in srgb, var(--brand-primary) 25%, transparent), transparent 60%)" }} />

      <div className="relative flex items-center justify-between px-6 pt-6">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
          {/* eslint-disable-next-line react-hooks/static-components -- Icon is a stable reference from a static lookup map */}
          <Icon className="h-5 w-5 text-brand" strokeWidth={1.75} />
        </span>
        <ArrowUpRight className="h-6 w-6 -translate-x-2 translate-y-2 text-brand opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
      </div>

      <div className="relative flex-1" />

      <div className="relative px-6 pb-6 transition-transform duration-500 group-hover:-translate-y-1">
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
          {program.category} · {program.duration}
        </p>
        <h3 className="heading-font text-2xl leading-tight tracking-wide">{program.name}</h3>
        <p className="mt-2 line-clamp-2 max-h-0 overflow-hidden text-sm leading-relaxed text-foreground/70 opacity-0 transition-all duration-500 group-hover:max-h-16 group-hover:opacity-100">
          {program.shortDescription}
        </p>
        <p className="mt-2 text-xs uppercase tracking-wider text-foreground/50">
          {DIFFICULTY_LABELS[program.difficulty] ?? program.difficulty}
        </p>
      </div>
    </Link>
  );
}
