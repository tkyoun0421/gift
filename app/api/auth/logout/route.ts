import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "LOGOUT_FAILED",
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "로그아웃되었습니다.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Logout internal error:", err);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "서버 오류" },
      { status: 500 }
    );
  }
}
