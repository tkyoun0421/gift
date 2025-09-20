import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "30");
    const status = searchParams.get("status") || "all";
    const offset = (page - 1) * limit;

    const supabase = await createClient();

    let dataQuery = supabase.from("applicants").select("*");
    if (status === "pending") {
      dataQuery = dataQuery.or("is_completed.is.null,is_completed.eq.false");
    } else if (status === "completed") {
      dataQuery = dataQuery.eq("is_completed", true);
    }

    const { data, error } = await dataQuery
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: "DATABASE_ERROR", message: "목록 조회 실패" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, applicants: data || [] },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "서버 오류" },
      { status: 500 }
    );
  }
}
