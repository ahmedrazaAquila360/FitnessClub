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

// About now lives at its own /about page. Rows saved before that change still
// point at the homepage anchor, so map them to the page at read time.
const LEGACY_NAV_HREFS: Record<string, string> = {
  "#about": "/about",
  "/#about": "/about",
};

export async function getNavigation(location: "HEADER" | "FOOTER") {
  const items = await prisma.navigationItem.findMany({
    where: { location, isActive: true },
    orderBy: { order: "asc" },
  });
  return items.map((item) => ({
    ...item,
    href: LEGACY_NAV_HREFS[item.href] ?? item.href,
  }));
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
