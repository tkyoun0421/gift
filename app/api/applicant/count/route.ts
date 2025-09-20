import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";

    const supabase = await createClient();

    let countQuery = supabase
      .from("applicants")
      .select("id", { count: "exact", head: true });

    if (status === "pending") {
      countQuery = countQuery.or("is_completed.is.null,is_completed.eq.false");
    } else if (status === "completed") {
      countQuery = countQuery.eq("is_completed", true);
    }

    const { count, error } = await countQuery;
    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_ERROR",
          message: "카운트 조회 실패",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, count: count || 0 },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "서버 오류" },
      { status: 500 }
    );
  }
}
