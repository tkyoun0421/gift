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

    // 가입 코드 검증 (공백 제거 및 대소문자 처리)
    const trimmedCode = code.trim();
    const { data: inviteCodes, error } = await supabase
      .from("invite_code")
      .select("*")
      .eq("code", trimmedCode);

    if (error) {
      console.error("Supabase 에러:", error);
      return NextResponse.json(
        { error: `데이터베이스 오류: ${error.message}` },
        { status: 400 }
      );
    }

    if (!inviteCodes || inviteCodes.length === 0) {
      return NextResponse.json(
        { error: "유효하지 않은 가입 코드입니다." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "유효한 가입 코드입니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error("가입 코드 검증 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
