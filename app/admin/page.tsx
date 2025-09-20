import { Suspense } from "react";
import { getApplicantData } from "@/features/applicant/actions";
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
  const { page, status } = await searchParams;

  const data = await getApplicantData({ page, status });

  return (
    <div className="p-4 lg:p-6 pt-20 lg:pt-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">신청자 관리</h1>
            <p className="text-gray-500 mt-1">
              서비스 신청자들의 정보를 확인하고 관리하세요
            </p>
          </div>
        </div>

        <ApplicantStats stats={data.stats} />

        <ApplicantFilters stats={data.stats} />
      </div>

      <Suspense
        key={`${page || "1"}-${status || "all"}`}
        fallback={<TableSkeleton />}
      >
        <ApplicantTable
          applicants={data.applicants}
          pagination={data.pagination}
          currentStatus={status || "all"}
        />
      </Suspense>
    </div>
  );
}
