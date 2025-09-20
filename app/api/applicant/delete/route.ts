import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { deleteApplicantsServer } from "@/features/applicant/actions/deleteApplicantsServer";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = (searchParams.get("ids") || "").split(",").filter(Boolean);
    const res = await deleteApplicantsServer(ids);
    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: res.error, message: res.message },
        { status: 400 }
      );
    }
    revalidateTag("applicants");
    revalidatePath("/admin");
    return NextResponse.json(
      { success: true, message: `${res.count}명의 신청자가 삭제되었습니다.` },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "서버 오류" },
      { status: 500 }
    );
  }
}
