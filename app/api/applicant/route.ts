import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/shared/lib/supabase/server";
import { ApplicantInsertSchema } from "@/features/applicant/models/applicantSchema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "30");
    const status = searchParams.get("status") || "all";
    const offset = (page - 1) * limit;

    const supabase = await createClient();

    // 필터링된 모든 ID를 가져와서 정확한 개수 계산
    let countQuery = supabase.from("applicants").select("id");

    // 상태 필터 적용 (count용)
    if (status === "pending") {
      countQuery = countQuery.or("is_completed.is.null,is_completed.eq.false");
    } else if (status === "completed") {
      countQuery = countQuery.eq("is_completed", true);
    }

    // 실제 페이지 데이터 가져오기
    let dataQuery = supabase.from("applicants").select("*");

    // 상태 필터 적용 (data용)
    if (status === "pending") {
      dataQuery = dataQuery.or("is_completed.is.null,is_completed.eq.false");
    } else if (status === "completed") {
      dataQuery = dataQuery.eq("is_completed", true);
    }

    // 두 쿼리 병렬 실행
    const [countResult, dataResult] = await Promise.all([
      countQuery,
      dataQuery
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: false }),
    ]);

    if (countResult.error || dataResult.error) {
      console.error(
        "applicants select error:",
        countResult.error || dataResult.error
      );
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_ERROR",
          message: "신청자 목록 조회에 실패했습니다.",
        },
        { status: 500 }
      );
    }

    const applicants = dataResult.data;
    const filteredCount = countResult.data?.length || 0; // 실제 필터링된 ID 개수

    // 통계 데이터도 함께 계산
    const { data: allApplicants } = await supabase
      .from("applicants")
      .select("id, is_completed, created_at");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount =
      allApplicants?.filter(app => {
        const appDate = new Date(app.created_at);
        appDate.setHours(0, 0, 0, 0);
        return appDate.getTime() === today.getTime();
      }).length || 0;

    const pendingCount =
      allApplicants?.filter(app => !app.is_completed).length || 0;
    const completedCount =
      allApplicants?.filter(app => app.is_completed).length || 0;
    const totalCount = allApplicants?.length || 0;

    return NextResponse.json(
      {
        success: true,
        applicants: applicants || [],
        pagination: {
          currentPage: page,
          totalPages: Math.ceil((filteredCount || 0) / limit),
          totalCount: filteredCount || 0,
          limit,
        },
        stats: {
          today: todayCount,
          pending: pendingCount,
          completed: completedCount,
          total: totalCount,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("applicants GET error:", err);
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("ids");

    if (!ids) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "삭제할 신청자 ID가 필요합니다.",
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
      .delete()
      .in("id", idArray);

    if (error) {
      console.error("applicants delete error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_ERROR",
          message: "신청자 삭제에 실패했습니다.",
        },
        { status: 500 }
      );
    }

    // 관리자 페이지 캐시 무효화
    revalidatePath("/admin");

    return NextResponse.json(
      {
        success: true,
        message: `${idArray.length}명의 신청자가 삭제되었습니다.`,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("applicants DELETE error:", err);
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
