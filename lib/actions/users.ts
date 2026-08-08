"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, MANAGE_USERS_ROLES } from "@/lib/auth/guards";
import { logActivity } from "@/lib/actions/activity";
import { hashPassword } from "@/lib/auth/password";
import type { ActionResult } from "@/lib/actions/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"]),
});

export async function createUser(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireRole(MANAGE_USERS_ROLES);
  const parsed = createUserSchema.safeParse({
    name: formData.get("name"),
    email: String(formData.get("email") || "").toLowerCase(),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { error: "A user with that email already exists." };

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
      passwordHash,
    },
  });
  await logActivity({ userId: session.id, action: "CREATE", entityType: "User", entityId: user.id, description: `${session.name} invited ${user.name} as ${user.role}` });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function toggleUserActive(id: string, isActive: boolean) {
  const session = await requireRole(MANAGE_USERS_ROLES);
  const user = await prisma.user.update({ where: { id }, data: { isActive } });
  await logActivity({ userId: session.id, action: isActive ? "ACTIVATE" : "DEACTIVATE", entityType: "User", entityId: id, description: `${session.name} ${isActive ? "activated" : "deactivated"} ${user.name}` });
  revalidatePath("/admin/users");
}

export async function updateUserRole(id: string, role: "SUPER_ADMIN" | "ADMIN" | "EDITOR") {
  const session = await requireRole(MANAGE_USERS_ROLES);
  const user = await prisma.user.update({ where: { id }, data: { role } });
  await logActivity({ userId: session.id, action: "UPDATE", entityType: "User", entityId: id, description: `${session.name} changed ${user.name}'s role to ${role}` });
  revalidatePath("/admin/users");
}

export async function deleteUser(id: string) {
  const session = await requireRole(MANAGE_USERS_ROLES);
  if (id === session.id) return;
  const user = await prisma.user.delete({ where: { id } });
  await logActivity({ userId: session.id, action: "DELETE", entityType: "User", entityId: id, description: `${session.name} removed user ${user.name}` });
  revalidatePath("/admin/users");
}
