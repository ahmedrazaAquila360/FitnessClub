"use client";

import { useTransition } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { ToggleActiveSwitch } from "@/components/admin/toggle-active-switch";
import { updateUserRole, toggleUserActive, deleteUser } from "@/lib/actions/users";
import type { Role } from "@prisma/client";

export function UserRowActions({
  id,
  role,
  isActive,
  isSelf,
}: {
  id: string;
  role: Role;
  isActive: boolean;
  isSelf: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-3">
      <Select
        defaultValue={role}
        disabled={isSelf || isPending}
        onValueChange={(next) => startTransition(() => updateUserRole(id, next as Role))}
      >
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
          <SelectItem value="EDITOR">Editor</SelectItem>
        </SelectContent>
      </Select>
      <ToggleActiveSwitch id={id} isActive={isActive} onToggle={toggleUserActive} />
      {!isSelf && <ConfirmDeleteButton itemLabel="this user" onDelete={deleteUser.bind(null, id)} />}
    </div>
  );
}
