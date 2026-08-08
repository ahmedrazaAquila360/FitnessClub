import type { MetadataRoute } from "next";
import { getSEOSettings } from "@/lib/data/settings";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSEOSettings();
  const base = seo.canonicalUrl.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: seo.robotsIndex ? "/" : undefined,
      disallow: seo.robotsIndex ? "/admin" : "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
