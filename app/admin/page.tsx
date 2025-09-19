import { Suspense } from "react";
import { getApplicantData } from "@/features/applicant/hooks/useApplicantData";
import ApplicantTable from "@/features/applicant/ui/ApplicantTable";
import ApplicantStats from "@/features/applicant/ui/ApplicantStats";
import ApplicantFilters from "@/features/applicant/ui/ApplicantFilters";
import TableSkeleton from "@/features/applicant/ui/TableSkeleton";

interface SearchParams {
  page?: string;
  status?: string;
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const data = await getApplicantData(resolvedSearchParams);

  return (
    <div className="p-4 lg:p-6 pt-20 lg:pt-6">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">신청자 관리</h1>
            <p className="text-gray-500 mt-1">
              서비스 신청자들의 정보를 확인하고 관리하세요
            </p>
          </div>
        </div>

        {/* 통계 요약 */}
        <ApplicantStats stats={data.stats} />

        {/* 필터 */}
        <ApplicantFilters stats={data.stats} />
      </div>

      {/* 테이블 */}
      <Suspense
        key={`${resolvedSearchParams.page || "1"}-${resolvedSearchParams.status || "all"}`}
        fallback={<TableSkeleton />}
      >
        <ApplicantTable
          applicants={data.applicants}
          pagination={data.pagination}
          currentStatus={resolvedSearchParams.status || "all"}
        />
      </Suspense>
    </div>
  );
}
