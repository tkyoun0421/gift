import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { createClient } from "@/shared/lib/supabase/server";

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

    const supabase = await createClient();

    const { error } = await supabase
      .from("applicants")
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
      })
      .in("id", idArray);

    if (error) {
      console.error("applicants complete error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_ERROR",
          message: "상담 완료 처리에 실패했습니다.",
        },
        { status: 500 }
      );
    }

    // 신청자 관련 캐시 무효화
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
