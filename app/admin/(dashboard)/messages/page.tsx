import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MessageRowActions } from "@/components/admin/messages/message-row-actions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <AdminPageHeader
        title="Contact Messages"
        description={`${messages.filter((m) => !m.isRead).length} unread of ${messages.length} total.`}
      />

      {messages.length === 0 ? (
        <p className="py-10 text-center text-foreground/50">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "rounded-2xl border p-5",
                message.isRead ? "border-white/10 bg-white/2" : "border-brand/30 bg-brand/5"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{message.name}</p>
                    {!message.isRead && <Badge className="bg-brand text-black">New</Badge>}
                  </div>
                  <p className="text-sm text-foreground/50">
                    {message.email} {message.phone ? `· ${message.phone}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-foreground/40">
                    {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                  </span>
                  <MessageRowActions id={message.id} isRead={message.isRead} />
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/70">{message.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
