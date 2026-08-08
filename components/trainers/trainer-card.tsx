import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { InstagramIcon, XIcon, YoutubeIcon, FacebookIcon } from "@/components/icons/social-icons";

export function TrainerCard({
  trainer,
}: {
  trainer: {
    slug: string;
    name: string;
    image: string;
    position: string;
    specialization: string[];
    instagram?: string | null;
    twitter?: string | null;
    youtube?: string | null;
    facebook?: string | null;
  };
}) {
  const socials = [
    { icon: InstagramIcon, href: trainer.instagram },
    { icon: XIcon, href: trainer.twitter },
    { icon: FacebookIcon, href: trainer.facebook },
    { icon: YoutubeIcon, href: trainer.youtube },
  ].filter((s): s is { icon: typeof InstagramIcon; href: string } => Boolean(s.href));

  return (
    <div className="group relative flex aspect-3/4 w-full flex-col justify-end overflow-hidden rounded-3xl bg-[#0d0d0d] transition-transform duration-500 hover:-translate-y-2">
      <Image
        src={trainer.image}
        alt={trainer.name}
        fill
        sizes="(max-width: 768px) 90vw, 320px"
        className="object-cover grayscale-[35%] transition-all duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

      <Link
        href={`/trainers/${trainer.slug}`}
        data-cursor="view"
        aria-label={`View ${trainer.name}'s profile`}
        className="absolute inset-0 z-10"
      />

      <div className="pointer-events-none relative z-20 flex items-center justify-between gap-2 px-5 pb-1 pt-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
        {socials.map(({ icon: Icon, href }, i) => (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-foreground/80 backdrop-blur-sm transition-colors hover:border-brand hover:text-brand"
          >
            <Icon className="h-3.5 w-3.5" />
          </a>
        ))}
      </div>

      <div className="pointer-events-none relative z-20 px-5 pb-5 pt-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {trainer.specialization.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/15 px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-foreground/60"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="heading-font text-xl tracking-wide">{trainer.name}</h3>
            <p className="text-xs uppercase tracking-wider text-brand">{trainer.position}</p>
          </div>
          <ArrowUpRight className="h-5 w-5 shrink-0 -translate-x-1 text-foreground/40 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100" />
        </div>
      </div>
    </div>
  );
}
