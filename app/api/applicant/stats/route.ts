import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayIso = today.toISOString();

    const [totalRes, completedRes, pendingRes, todayRes] = await Promise.all([
      supabase.from("applicants").select("id", { count: "exact", head: true }),
      supabase
        .from("applicants")
        .select("id", { count: "exact", head: true })
        .eq("is_completed", true),
      supabase
        .from("applicants")
        .select("id", { count: "exact", head: true })
        .or("is_completed.is.null,is_completed.eq.false"),
      supabase
        .from("applicants")
        .select("id", { count: "exact", head: true })
        .gte("created_at", todayIso),
    ]);

    return NextResponse.json(
      {
        success: true,
        stats: {
          total: totalRes.count || 0,
          completed: completedRes.count || 0,
          pending: pendingRes.count || 0,
          today: todayRes.count || 0,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "서버 오류" },
      { status: 500 }
    );
  }
}
