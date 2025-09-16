import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: "가입 코드를 입력해주세요." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 가입 코드 사용 처리 (is_active 컬럼이 없으므로 삭제)
    const { error } = await supabase
      .from("invite_code")
      .delete()
      .eq("code", code);

    if (error) {
      console.error("가입 코드 사용 오류:", error);
      return NextResponse.json(
        { error: "서버 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "가입 코드가 사용되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error("가입 코드 사용 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
