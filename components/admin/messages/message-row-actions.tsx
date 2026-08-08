"use client";

import { useTransition } from "react";
import { MailOpen, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { markMessageRead, deleteMessage } from "@/lib/actions/contact";

export function MessageRowActions({ id, isRead }: { id: string; isRead: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        disabled={isPending}
        onClick={() => startTransition(() => markMessageRead(id, !isRead))}
        aria-label={isRead ? "Mark as unread" : "Mark as read"}
      >
        {isRead ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
      </Button>
      <ConfirmDeleteButton itemLabel="this message" onDelete={deleteMessage.bind(null, id)} />
    </div>
  );
}
