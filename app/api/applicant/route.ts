import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      contact,
      hasOverseasGiftExp,
      privacyConsent,
      marketingConsent,
    } = body;

    // 필수 필드 검증
    if (!name || !contact || !privacyConsent) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 신청자 정보 저장
    const { data: applicant, error } = await supabase
      .from("applicants")
      .insert({
        name,
        contact,
        has_overseas_gift_exp: hasOverseasGiftExp || false,
        privacy_consent: privacyConsent,
        marketing_consent: marketingConsent || false,
      })
      .select()
      .single();

    if (error) {
      console.error("신청자 등록 오류:", error);
      return NextResponse.json(
        { error: "서버 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "신청이 성공적으로 완료되었습니다.",
        applicant: {
          id: applicant.id,
          name: applicant.name,
          created_at: applicant.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("신청자 등록 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: applicants, error } = await supabase
      .from("applicants")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("신청자 목록 조회 오류:", error);
      return NextResponse.json(
        { error: "서버 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(applicants);
  } catch (error) {
    console.error("신청자 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
