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

    // 가입 코드 생성
    const { data: inviteCodes, error } = await supabase
      .from("invite_code")
      .insert({
        code,
      })
      .select();

    const inviteCode = inviteCodes?.[0];

    if (error) {
      console.error("가입 코드 생성 오류:", error);

      // 중복 코드 오류 처리
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "이미 존재하는 가입 코드입니다." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "서버 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "가입 코드가 생성되었습니다.",
        inviteCode: {
          id: inviteCode.id,
          code: inviteCode.code,
          createdAt: inviteCode.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("가입 코드 생성 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: inviteCodes, error } = await supabase
      .from("invite_code")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("가입 코드 목록 조회 오류:", error);
      return NextResponse.json(
        { error: "서버 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(inviteCodes);
  } catch (error) {
    console.error("가입 코드 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
