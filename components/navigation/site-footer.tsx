import Link from "next/link";
import Image from "next/image";
import { Dumbbell, MapPin, Phone, Mail, Clock } from "lucide-react";
import {
  getGymSettings,
  getFooterSettings,
  getNavigation,
  getSocialLinks,
} from "@/lib/data/settings";
import { getPrograms } from "@/lib/data/content";
import { NewsletterForm } from "@/components/navigation/newsletter-form";
import { SOCIAL_ICON_MAP } from "@/components/icons/social-icons";

export async function SiteFooter() {
  const [gym, footer, footerNav, social, programs] = await Promise.all([
    getGymSettings(),
    getFooterSettings(),
    getNavigation("FOOTER"),
    getSocialLinks(),
    getPrograms({ featuredOnly: true }),
  ]);

  const hours = gym.openingHours as Record<string, string>;

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#050505]">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-20 sm:px-8">
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-16 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="mb-5 flex items-center gap-2.5">
              {gym.logoUrl ? (
                <Image src={gym.logoUrl} alt={gym.brandName} width={36} height={36} className="h-9 w-9 object-contain" />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-black">
                  <Dumbbell className="h-4 w-4" strokeWidth={2.5} />
                </span>
              )}
              <span className="heading-font text-xl tracking-wide">{gym.brandName}</span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-foreground/60">
              {footer.description}
            </p>
            {social.length > 0 && (
              <div className="mt-6 flex items-center gap-3">
                {social.map((link) => {
                  const Icon = SOCIAL_ICON_MAP[link.platform];
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.platform}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-foreground/70 transition-colors hover:border-brand/50 hover:text-brand"
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40">
              Navigate
            </h3>
            <ul className="space-y-3 text-sm">
              {footerNav.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="text-foreground/70 transition-colors hover:text-brand">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40">
              Programs
            </h3>
            <ul className="space-y-3 text-sm">
              {programs.slice(0, 6).map((program) => (
                <li key={program.id}>
                  <Link
                    href={`/programs/${program.slug}`}
                    className="text-foreground/70 transition-colors hover:text-brand"
                  >
                    {program.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40">
              Visit Us
            </h3>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>
                  {gym.address}, {gym.city}, {gym.state} {gym.zip}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <a href={`tel:${gym.phone}`} className="hover:text-brand">
                  {gym.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <a href={`mailto:${gym.email}`} className="hover:text-brand">
                  {gym.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>
                  Mon–Fri: {hours.monday} <br />
                  Sat: {hours.saturday} · Sun: {hours.sunday}
                </span>
              </li>
            </ul>

            {footer.newsletterEnabled && (
              <div className="mt-8">
                <p className="mb-3 text-sm font-medium text-foreground/80">
                  {footer.newsletterHeading}
                </p>
                <NewsletterForm />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-foreground/40 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {footer.copyrightText}
          </p>
          <p className="flex items-center gap-1.5">
            Built for those who refuse average.
          </p>
        </div>
      </div>
    </footer>
  );
}
