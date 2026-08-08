import { formatDistanceToNow } from "date-fns";
import { prisma } from "@/lib/prisma";
import { requireRole, MANAGE_USERS_ROLES } from "@/lib/auth/guards";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InviteUserForm } from "@/components/admin/users/invite-user-form";
import { UserRowActions } from "@/components/admin/users/user-row-actions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await requireRole(MANAGE_USERS_ROLES);
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="heading-font text-2xl tracking-wide">USERS</h1>
          <p className="mt-1 text-sm text-foreground/50">Manage admin dashboard access and roles.</p>
        </div>
        <InviteUserForm />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>User</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Role / Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-foreground/45">{user.email}</p>
                </TableCell>
                <TableCell className="text-foreground/60">
                  {user.lastLoginAt
                    ? formatDistanceToNow(user.lastLoginAt, { addSuffix: true })
                    : "Never"}
                </TableCell>
                <TableCell>
                  <UserRowActions
                    id={user.id}
                    role={user.role}
                    isActive={user.isActive}
                    isSelf={user.id === session.id}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
