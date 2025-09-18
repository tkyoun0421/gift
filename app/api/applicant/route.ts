import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";
import { ApplicantInsertSchema } from "@/features/applicant/models/applicantSchema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = ApplicantInsertSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "입력값을 확인해주세요.",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { error } = await supabase.from("applicants").insert(parsed.data);

    if (error) {
      console.error("account_open_leads insert error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_ERROR",
          message: "저장에 실패했습니다.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "신청이 접수되었습니다.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("account-open POST error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message: "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
