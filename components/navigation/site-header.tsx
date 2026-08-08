import { getNavigation, getGymSettings } from "@/lib/data/settings";
import { getHero } from "@/lib/data/content";
import { Navbar } from "@/components/navigation/navbar";

export async function SiteHeader() {
  const [navItems, gym, hero] = await Promise.all([
    getNavigation("HEADER"),
    getGymSettings(),
    getHero(),
  ]);

  return (
    <Navbar
      navItems={navItems.map((n) => ({
        id: n.id,
        label: n.label,
        href: n.href,
        isExternal: n.isExternal,
      }))}
      brandName={gym.brandName}
      logoUrl={gym.logoUrl}
      ctaLabel={hero.primaryCtaLabel}
      ctaHref={hero.primaryCtaHref}
    />
  );
}
