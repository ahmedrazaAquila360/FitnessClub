import { Reveal } from "@/components/animations/reveal";
import { MembershipGrid } from "@/components/memberships/membership-grid";

export function MembershipSection() {
  return (
    <section id="memberships" className="relative overflow-hidden bg-[#080808] py-28 sm:py-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[900px] -translate-x-1/2 rounded-full bg-brand/5 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              Membership
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="heading-font mt-4 text-4xl leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
              INVEST IN YOUR RESULTS
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 text-base leading-relaxed text-foreground/60">
              No hidden fees. No long-term traps. Just transparent pricing and a team invested in
              your progress.
            </p>
          </Reveal>
        </div>

        <MembershipGrid />
      </div>
    </section>
  );
}
