import { formatDistanceToNow } from "date-fns";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-emerald-500/15 text-emerald-400",
  UPDATE: "bg-blue-500/15 text-blue-400",
  DELETE: "bg-red-500/15 text-red-400",
  LOGIN: "bg-brand/15 text-brand",
  ACTIVATE: "bg-emerald-500/15 text-emerald-400",
  DEACTIVATE: "bg-white/10 text-foreground/60",
  UPLOAD: "bg-purple-500/15 text-purple-400",
  REORDER: "bg-amber-500/15 text-amber-400",
  DUPLICATE: "bg-cyan-500/15 text-cyan-400",
  ENABLE: "bg-emerald-500/15 text-emerald-400",
  DISABLE: "bg-white/10 text-foreground/60",
};

export default async function AdminActivityPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { name: true } } },
  });

  return (
    <div>
      <AdminPageHeader title="Activity Log" description="A full history of changes made to your website." />
      {logs.length === 0 ? (
        <p className="py-10 text-center text-foreground/50">No activity recorded yet.</p>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/2 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Badge className={ACTION_COLORS[log.action] ?? "bg-white/10 text-foreground/60"}>
                  {log.action}
                </Badge>
                <span className="text-sm text-foreground/80">{log.description}</span>
              </div>
              <span className="text-xs text-foreground/40">
                {formatDistanceToNow(log.createdAt, { addSuffix: true })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
