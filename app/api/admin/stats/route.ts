import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // 미들웨어에서 이미 인증 처리됨, 바로 데이터 조회

    // 통계 데이터 가져오기
    const { data: users = [] } = await supabase.from("users").select("*");
    const { data: applicants = [] } = await supabase
      .from("applicants")
      .select("*");

    // 오늘 신청한 사람들 계산
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newApplicants = applicants.filter((app: any) => {
      const appDate = new Date(app.created_at);
      appDate.setHours(0, 0, 0, 0);
      return appDate.getTime() === today.getTime();
    }).length;

    const userStats = {
      totalUsers: users.length,
      confirmedUsers: users.filter((user: any) => user.emailConfirmed).length,
    };

    const applicantStats = {
      totalApplicants: applicants.length,
      withExperience: applicants.filter((app: any) => app.has_overseas_gift_exp)
        .length,
      newApplicants,
    };

    return NextResponse.json(
      {
        success: true,
        userStats,
        applicantStats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("통계 조회 에러:", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "서버 오류" },
      { status: 500 }
    );
  }
}
