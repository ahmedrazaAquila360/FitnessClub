import { prisma } from "@/lib/prisma";
import { SINGLETON_ID, HOMEPAGE_SECTIONS } from "@/lib/constants";

export async function getGymSettings() {
  const settings = await prisma.gymSettings.findUnique({
    where: { id: SINGLETON_ID },
  });
  if (settings) return settings;
  return prisma.gymSettings.create({ data: { id: SINGLETON_ID } });
}

export async function getThemeSettings() {
  const settings = await prisma.themeSettings.findUnique({
    where: { id: SINGLETON_ID },
  });
  if (settings) return settings;
  return prisma.themeSettings.create({ data: { id: SINGLETON_ID } });
}

export async function getSEOSettings() {
  const settings = await prisma.sEOSettings.findUnique({
    where: { id: SINGLETON_ID },
  });
  if (settings) return settings;
  return prisma.sEOSettings.create({ data: { id: SINGLETON_ID } });
}

export async function getFooterSettings() {
  const settings = await prisma.footerSettings.findUnique({
    where: { id: SINGLETON_ID },
  });
  if (settings) return settings;
  return prisma.footerSettings.create({ data: { id: SINGLETON_ID } });
}

export async function getNavigation(location: "HEADER" | "FOOTER") {
  return prisma.navigationItem.findMany({
    where: { location, isActive: true },
    orderBy: { order: "asc" },
  });
}

export async function getSocialLinks() {
  return prisma.socialLink.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

export async function getPageSections() {
  const sections = await prisma.pageSection.findMany({
    orderBy: { order: "asc" },
  });
  if (sections.length > 0) return sections;
  // Self-heal: seed defaults if empty so the homepage never renders blank.
  await prisma.pageSection.createMany({
    data: HOMEPAGE_SECTIONS.map((s, i) => ({ ...s, order: i })),
    skipDuplicates: true,
  });
  return prisma.pageSection.findMany({ orderBy: { order: "asc" } });
}
