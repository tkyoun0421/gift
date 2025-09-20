import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { createApplicantServer } from "@/features/applicant/actions/createApplicantServer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await createApplicantServer(body);
    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: res.error, message: res.message },
        { status: 400 }
      );
    }
    revalidateTag("applicants");
    revalidatePath("/admin");
    return NextResponse.json(
      { success: true, message: "신청이 접수되었습니다." },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "서버 오류" },
      { status: 500 }
    );
  }
}
