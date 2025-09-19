import { createClient } from "@/shared/lib/supabase/server";

interface SearchParams {
  page?: string;
  status?: string;
}

export async function getApplicantData(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || "1");
  const status = searchParams.status || "all";
  const limit = 30;
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  // 필터링된 결과의 정확한 개수를 구하기 위해 count 전용 쿼리
  let countQuery = supabase
    .from("applicants")
    .select("*", { count: "exact", head: true });

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
  const [
    { count: filteredCount, error: countError },
    { data: applicants, error: dataError },
  ] = await Promise.all([
    countQuery,
    dataQuery
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false }),
  ]);

  if (countError || dataError) {
    throw new Error("신청자 목록 조회에 실패했습니다.");
  }

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

  return {
    applicants: applicants || [],
    pagination: {
      currentPage: page,
      totalPages: Math.ceil((filteredCount || 0) / limit),
      totalCount: filteredCount || 0, // 필터링된 결과의 총 개수
      limit,
    },
    stats: {
      today: todayCount,
      pending: pendingCount,
      completed: completedCount,
      total: totalCount,
    },
  };
}
