import Link from "next/link";
import { Dumbbell, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="bg-grid relative flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden bg-background px-6 pt-24 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[140px]" />
      <div className="relative flex flex-col items-center">
        <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-black">
          <Dumbbell className="h-6 w-6" strokeWidth={2.5} />
        </span>
        <p className="heading-font text-[8rem] leading-none tracking-tight text-brand sm:text-[10rem]">
          404
        </p>
        <h1 className="heading-font mt-2 text-3xl tracking-tight sm:text-4xl">
          THIS SET DOESN&apos;T EXIST
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-foreground/60">
          The page you&apos;re looking for has been moved, renamed, or never existed. Here&apos;s
          where you probably meant to go.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-transform hover:scale-[1.03]"
          >
            Back to Home
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/programs"
            className="glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-foreground transition-transform hover:scale-[1.03]"
          >
            View Programs
          </Link>
        </div>
      </div>
    </section>
  );
}
