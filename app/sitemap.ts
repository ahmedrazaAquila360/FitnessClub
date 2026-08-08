import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSEOSettings } from "@/lib/data/settings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = await getSEOSettings();
  const base = seo.canonicalUrl.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/programs",
    "/membership",
    "/trainers",
    "/schedule",
    "/gallery",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const [programs, trainers] = await Promise.all([
    prisma.program.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.trainer.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const programRoutes: MetadataRoute.Sitemap = programs.map((p) => ({
    url: `${base}/programs/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const trainerRoutes: MetadataRoute.Sitemap = trainers.map((t) => ({
    url: `${base}/trainers/${t.slug}`,
    lastModified: t.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...programRoutes, ...trainerRoutes];
}
