import { prisma } from "@/lib/prisma";
import { SINGLETON_ID } from "@/lib/constants";

export async function getHero() {
  const hero = await prisma.heroSection.findUnique({
    where: { id: SINGLETON_ID },
  });
  if (hero) return hero;
  return prisma.heroSection.create({ data: { id: SINGLETON_ID } });
}

export async function getAbout() {
  const about = await prisma.aboutSection.findUnique({
    where: { id: SINGLETON_ID },
  });
  if (about) return about;
  return prisma.aboutSection.create({ data: { id: SINGLETON_ID } });
}

export async function getStatistics() {
  return prisma.statistic.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

export async function getPrograms(opts?: { featuredOnly?: boolean }) {
  return prisma.program.findMany({
    where: { isActive: true, ...(opts?.featuredOnly ? { isFeatured: true } : {}) },
    orderBy: { order: "asc" },
    include: { trainer: { select: { name: true, slug: true } } },
  });
}

export async function getProgramBySlug(slug: string) {
  return prisma.program.findUnique({
    where: { slug, isActive: true },
    include: { trainer: true, classes: { where: { isActive: true } } },
  });
}

export async function getMembershipPlans() {
  return prisma.membershipPlan.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

export async function getTrainers(opts?: { featuredOnly?: boolean }) {
  return prisma.trainer.findMany({
    where: { isActive: true, ...(opts?.featuredOnly ? { isFeatured: true } : {}) },
    orderBy: { order: "asc" },
    include: { programs: { select: { name: true, slug: true }, where: { isActive: true } } },
  });
}

export async function getTrainerBySlug(slug: string) {
  return prisma.trainer.findUnique({
    where: { slug, isActive: true },
    include: {
      programs: { where: { isActive: true } },
      classes: { where: { isActive: true }, include: { program: true } },
    },
  });
}

export async function getClassSchedule() {
  return prisma.classSchedule.findMany({
    where: { isActive: true },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    include: { trainer: { select: { name: true, slug: true, image: true } }, program: { select: { name: true, slug: true } } },
  });
}

export async function getFacilities() {
  return prisma.facility.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

export async function getTransformations(opts?: { featuredOnly?: boolean }) {
  return prisma.transformation.findMany({
    where: { isActive: true, ...(opts?.featuredOnly ? { isFeatured: true } : {}) },
    orderBy: { order: "asc" },
  });
}

export async function getTestimonials(opts?: { featuredOnly?: boolean }) {
  return prisma.testimonial.findMany({
    where: { isActive: true, ...(opts?.featuredOnly ? { isFeatured: true } : {}) },
    orderBy: { order: "asc" },
  });
}

export async function getGalleryItems(category?: string) {
  return prisma.galleryItem.findMany({
    where: {
      isActive: true,
      ...(category && category !== "ALL" ? { category: category as never } : {}),
    },
    orderBy: { order: "asc" },
  });
}

export async function getFAQs() {
  return prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

export async function getWhyChooseUsItems() {
  return prisma.whyChooseUsItem.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

export async function getCTASection() {
  const cta = await prisma.cTASection.findUnique({
    where: { id: SINGLETON_ID },
  });
  if (cta) return cta;
  return prisma.cTASection.create({ data: { id: SINGLETON_ID } });
}
