import "server-only";
import { redirect } from "next/navigation";
import { getSession, type SessionPayload } from "@/lib/auth/session";
import type { Role } from "@prisma/client";

export async function requireUser(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function requireRole(roles: Role[]): Promise<SessionPayload> {
  const session = await requireUser();
  if (!roles.includes(session.role)) redirect("/admin");
  return session;
}

export const ALL_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "EDITOR"];
export const MANAGE_USERS_ROLES: Role[] = ["SUPER_ADMIN"];
export const MANAGE_SETTINGS_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN"];
