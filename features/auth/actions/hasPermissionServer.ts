"use server";

import { getCurrentUserServer } from "./getCurrentUserServer";

export async function hasPermissionServer(
  requiredRole: "user" | "admin" | "super_admin"
): Promise<boolean> {
  const user = await getCurrentUserServer();
  if (!user) return false;
  const rank = { user: 1, admin: 2, super_admin: 3 } as const;
  return rank[user.role] >= rank[requiredRole];
}
