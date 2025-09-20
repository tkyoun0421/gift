"use server";

import { createClient } from "@/shared/lib/supabase/server";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "super_admin";
  created_at?: string;
  updated_at?: string;
}

export async function getCurrentUserServer(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();
  return (userData as AuthUser) ?? null;
}
