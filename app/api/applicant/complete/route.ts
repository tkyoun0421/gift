import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { completeApplicantsServer } from "@/features/applicant/actions/completeApplicantsServer";

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("ids");

    if (!ids) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "완료 처리할 신청자 ID가 필요합니다.",
        },
        { status: 400 }
      );
    }

    const idArray = ids.split(",").filter(id => id.trim());

    if (idArray.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "유효한 신청자 ID가 필요합니다.",
        },
        { status: 400 }
      );
    }

    const res = await completeApplicantsServer(idArray);
    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: res.error, message: res.message },
        { status: 400 }
      );
    }

    revalidateTag("applicants");
    revalidatePath("/admin");

    return NextResponse.json(
      {
        success: true,
        message: `${idArray.length}명의 상담이 완료 처리되었습니다.`,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("applicants complete error:", err);
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
