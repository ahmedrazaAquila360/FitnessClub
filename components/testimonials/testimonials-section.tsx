import { getTestimonials } from "@/lib/data/content";
import { Reveal } from "@/components/animations/reveal";
import { TestimonialsCarousel } from "@/components/testimonials/testimonials-carousel";

export async function TestimonialsSection() {
  const testimonials = await getTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="relative overflow-hidden bg-[#080808] py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              Member Voices
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="heading-font mt-4 text-4xl leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
              DON&apos;T TAKE OUR WORD FOR IT
            </h2>
          </Reveal>
        </div>
        <TestimonialsCarousel
          testimonials={testimonials.map((t) => ({
            id: t.id,
            name: t.name,
            image: t.image,
            rating: t.rating,
            content: t.content,
            membership: t.membership,
          }))}
        />
      </div>
    </section>
  );
}
