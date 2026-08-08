import Link from "next/link";
import {
  Users,
  CreditCard,
  Dumbbell,
  UserCog,
  CalendarDays,
  Star,
  Image as ImageIcon,
  MessageSquare,
  Plus,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getDashboardStats, getRecentActivity, getMessagesTrend } from "@/lib/data/dashboard";
import { StatCard } from "@/components/admin/stat-card";
import { MessagesChart } from "@/components/admin/messages-chart";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, activity, trend] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
    getMessagesTrend(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="heading-font text-2xl tracking-wide">DASHBOARD</h1>
        <p className="mt-1 text-sm text-foreground/50">
          Here&apos;s what&apos;s happening at your club today.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Members" value={stats.totalMembers} icon={Users} accent />
        <StatCard label="Active Plans" value={stats.activePlans} icon={CreditCard} />
        <StatCard label="Programs" value={stats.programs} icon={Dumbbell} />
        <StatCard label="Trainers" value={stats.trainers} icon={UserCog} />
        <StatCard label="Upcoming Classes" value={stats.upcomingClasses} icon={CalendarDays} />
        <StatCard label="Testimonials" value={stats.testimonials} icon={Star} />
        <StatCard label="Gallery Items" value={stats.galleryItems} icon={ImageIcon} />
        <StatCard
          label="Contact Messages"
          value={`${stats.unreadMessages} new`}
          icon={MessageSquare}
          accent={stats.unreadMessages > 0}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/2 p-6 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/60">
            Contact Messages — Last 14 Days
          </h2>
          <MessagesChart data={trend} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/2 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/60">
            System Status
          </h2>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-foreground/70">
                <CheckCircle2 className="h-4 w-4 text-brand" /> Database
              </span>
              <span className="text-foreground/45">Connected</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-foreground/70">
                <Layers className="h-4 w-4 text-brand" /> Homepage Sections
              </span>
              <span className="text-foreground/45">
                {stats.enabledSections}/{stats.totalSections} enabled
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-foreground/70">
                <Users className="h-4 w-4 text-brand" /> Active Admins
              </span>
              <span className="text-foreground/45">{stats.activeUsers}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-foreground/70">
                <MessageSquare className="h-4 w-4 text-brand" /> Total Messages
              </span>
              <span className="text-foreground/45">{stats.totalMessages}</span>
            </li>
          </ul>

          <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-foreground/60">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {[
              { href: "/admin/programs/new", label: "New Program" },
              { href: "/admin/trainers/new", label: "New Trainer" },
              { href: "/admin/schedule/new", label: "New Class" },
              { href: "/admin/testimonials/new", label: "New Testimonial" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-foreground/70 transition-colors hover:border-brand/40 hover:text-brand"
              >
                <Plus className="h-3.5 w-3.5" /> {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/2 p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/60">
          Recent Activity
        </h2>
        {activity.length === 0 ? (
          <p className="text-sm text-foreground/45">No activity yet.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {activity.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="text-foreground/75">{item.description}</span>
                <span className="shrink-0 text-xs text-foreground/40">
                  {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
