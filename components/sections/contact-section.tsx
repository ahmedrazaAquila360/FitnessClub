import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { getGymSettings } from "@/lib/data/settings";
import { WEEK_DAY_KEYS } from "@/lib/constants";
import { Reveal } from "@/components/animations/reveal";
import { ContactForm } from "@/components/sections/contact-form";

export async function ContactSection({ showHeading = true }: { showHeading?: boolean }) {
  const gym = await getGymSettings();
  const hours = gym.openingHours as Record<string, string>;
  const mapSrc = `https://www.google.com/maps?q=${gym.latitude},${gym.longitude}&z=14&output=embed`;
  const whatsappHref = `https://wa.me/${gym.whatsapp.replace(/[^0-9]/g, "")}`;

  return (
    <section id="contact" className="relative bg-background py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {showHeading && (
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                Get In Touch
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="heading-font mt-4 text-4xl leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
                LET&apos;S START YOUR JOURNEY
              </h2>
            </Reveal>
          </div>
        )}

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col gap-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoCard icon={MapPin} label="Address">
                  {gym.address}, {gym.city}, {gym.state} {gym.zip}
                </InfoCard>
                <InfoCard icon={Phone} label="Phone">
                  <a href={`tel:${gym.phone}`} className="hover:text-brand">
                    {gym.phone}
                  </a>
                </InfoCard>
                <InfoCard icon={Mail} label="Email">
                  <a href={`mailto:${gym.email}`} className="hover:text-brand">
                    {gym.email}
                  </a>
                </InfoCard>
                <InfoCard icon={MessageCircle} label="WhatsApp">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                    Chat with us
                  </a>
                </InfoCard>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/2 p-5">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40">
                  <Clock className="h-3.5 w-3.5 text-brand" /> Opening Hours
                </div>
                <ul className="grid grid-cols-1 gap-1.5 text-sm text-foreground/65 sm:grid-cols-2">
                  {WEEK_DAY_KEYS.map((day) => (
                    <li key={day} className="flex justify-between gap-4 capitalize">
                      <span>{day}</span>
                      <span className="text-foreground/45">{hours[day]}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="min-h-55 flex-1 overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  src={mapSrc}
                  title="Gym location"
                  className="h-full min-h-55 w-full grayscale invert-92 contrast-110"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="rounded-3xl border border-white/10 bg-white/2 p-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/2 p-5">
      <Icon className="mb-3 h-4 w-4 text-brand" />
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/40">
        {label}
      </p>
      <p className="mt-1.5 text-sm text-foreground/75">{children}</p>
    </div>
  );
}
