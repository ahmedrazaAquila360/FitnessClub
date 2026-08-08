import { getHero } from "@/lib/data/content";
import { getStatistics } from "@/lib/data/content";
import { HeroContent } from "@/components/hero/hero-content";

export async function Hero() {
  const [hero, stats] = await Promise.all([getHero(), getStatistics()]);
  if (!hero.isActive) return null;

  const highlightStat = stats[0];

  return <HeroContent hero={hero} highlightStat={highlightStat ?? null} />;
}
