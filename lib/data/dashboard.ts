import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [
    membersStat,
    activePlans,
    programs,
    trainers,
    upcomingClasses,
    testimonials,
    galleryItems,
    unreadMessages,
    totalMessages,
    enabledSections,
    totalSections,
    activeUsers,
  ] = await Promise.all([
    prisma.statistic.findFirst({ where: { label: { contains: "Member", mode: "insensitive" } } }),
    prisma.membershipPlan.count({ where: { isActive: true } }),
    prisma.program.count({ where: { isActive: true } }),
    prisma.trainer.count({ where: { isActive: true } }),
    prisma.classSchedule.count({ where: { isActive: true } }),
    prisma.testimonial.count({ where: { isActive: true } }),
    prisma.galleryItem.count({ where: { isActive: true } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.contactMessage.count(),
    prisma.pageSection.count({ where: { isEnabled: true } }),
    prisma.pageSection.count(),
    prisma.user.count({ where: { isActive: true } }),
  ]);

  return {
    totalMembers: membersStat ? `${membersStat.value.toLocaleString()}${membersStat.suffix}` : "—",
    activePlans,
    programs,
    trainers,
    upcomingClasses,
    testimonials,
    galleryItems,
    unreadMessages,
    totalMessages,
    enabledSections,
    totalSections,
    activeUsers,
  };
}

export async function getRecentActivity(limit = 8) {
  return prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { user: { select: { name: true } } },
  });
}

export async function getMessagesTrend(days = 14) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const messages = await prisma.contactMessage.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  });

  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, 0);
  }
  for (const m of messages) {
    const key = m.createdAt.toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return Array.from(buckets.entries()).map(([date, count]) => ({
    date: date.slice(5),
    messages: count,
  }));
}
