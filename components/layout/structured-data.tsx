import { getGymSettings, getSEOSettings } from "@/lib/data/settings";
import { WEEK_DAY_KEYS } from "@/lib/constants";

export async function StructuredData() {
  const [gym, seo] = await Promise.all([getGymSettings(), getSEOSettings()]);
  const hours = gym.openingHours as Record<string, string>;

  const dayMap: Record<string, string> = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": seo.structuredDataType || "HealthClub",
    name: gym.brandName,
    description: seo.defaultDescription,
    image: seo.ogImage ?? undefined,
    telephone: gym.phone,
    email: gym.email,
    url: seo.canonicalUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: gym.address,
      addressLocality: gym.city,
      addressRegion: gym.state,
      postalCode: gym.zip,
      addressCountry: gym.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: gym.latitude,
      longitude: gym.longitude,
    },
    openingHoursSpecification: WEEK_DAY_KEYS.map((day) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: dayMap[day] ?? day,
      opens: hours[day]?.split(" - ")[0]?.trim(),
      closes: hours[day]?.split(" - ")[1]?.trim(),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
