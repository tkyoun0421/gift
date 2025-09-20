"use server";

import { createClient } from "@/shared/lib/supabase/server";

export async function getApplicantStats() {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString();

  const [totalRes, todayRes] = await Promise.all([
    supabase.from("applicants").select("id", { count: "exact", head: true }),
    supabase
      .from("applicants")
      .select("id", { count: "exact", head: true })
      .gte("created_at", todayIso),
  ]);

  return { today: todayRes.count || 0, total: totalRes.count || 0 } as const;
}
