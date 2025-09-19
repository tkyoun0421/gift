"use client";

import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { useApplicantTable } from "@/features/applicant/hooks/useApplicantTable";

interface Applicant {
  id: string;
  name: string;
  phone: string;
  has_futures_experience: boolean;
  is_completed?: boolean;
  completed_at?: string;
  created_at: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

interface ApplicantTableProps {
  applicants: Applicant[];
  pagination: PaginationInfo;
  currentStatus: string;
}

export default function ApplicantTable({
  applicants: initialApplicants,
  pagination,
  currentStatus,
}: ApplicantTableProps) {
  const {
    applicants,
    selectedIds,
    actionLoading,
    dataLoading,
    handlePageChange,
    handleSelectAll,
    handleSelectItem,
    handleComplete,
    handleDelete,
  } = useApplicantTable(initialApplicants);

  if (dataLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left w-12">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-4">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-12 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-gray-400 text-3xl">
            {currentStatus === "pending"
              ? "⏳"
              : currentStatus === "completed"
                ? "✅"
                : "📝"}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {currentStatus === "pending"
            ? "대기중인 신청자가 없습니다"
            : currentStatus === "completed"
              ? "완료된 신청자가 없습니다"
              : "신청자가 없습니다"}
        </h3>
        <p className="text-gray-500">
          {currentStatus === "pending"
            ? "모든 신청자의 상담이 완료되었습니다."
            : currentStatus === "completed"
              ? "아직 완료된 상담이 없습니다."
              : "아직 서비스 신청자가 없습니다."}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* 테이블 컨트롤 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {selectedIds.length}개 선택됨
          </span>
          {selectedIds.length > 0 && (
            <div className="flex gap-2">
              <Button
                onClick={() => handleComplete()}
                disabled={actionLoading}
                variant="outline"
                size="sm"
                className="h-8"
              >
                {actionLoading ? "처리중..." : "상담 완료"}
              </Button>
              <Button
                onClick={() => handleDelete()}
                disabled={actionLoading}
                variant="outline"
                size="sm"
                className="h-8"
              >
                {actionLoading ? "삭제중..." : "삭제"}
              </Button>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-500">
          총 {pagination.totalCount}명 · 페이지 {pagination.currentPage}/
          {pagination.totalPages}
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    checked={
                      applicants.length > 0 &&
                      applicants.every(app => selectedIds.includes(app.id))
                    }
                    onCheckedChange={checked => handleSelectAll(!!checked)}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이름
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  연락처
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  선물 경험
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  신청일시
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applicants.map(applicant => (
                <tr
                  key={applicant.id}
                  className={`transition-colors ${
                    applicant.is_completed
                      ? "bg-gray-50 opacity-60"
                      : "hover:bg-gray-50"
                  } ${selectedIds.includes(applicant.id) ? "bg-blue-50" : ""}`}
                >
                  <td className="px-4 py-4">
                    <Checkbox
                      checked={selectedIds.includes(applicant.id)}
                      onCheckedChange={checked =>
                        handleSelectItem(applicant.id, !!checked)
                      }
                    />
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`font-medium ${
                        applicant.is_completed
                          ? "text-gray-400"
                          : "text-gray-900"
                      }`}
                    >
                      {applicant.name}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-4 text-sm ${
                      applicant.is_completed ? "text-gray-400" : "text-gray-900"
                    }`}
                  >
                    {applicant.phone}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        applicant.is_completed
                          ? "bg-gray-100 text-gray-400"
                          : applicant.has_futures_experience
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {applicant.has_futures_experience ? "있음" : "없음"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        applicant.is_completed
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {applicant.is_completed ? "상담완료" : "대기중"}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-4 text-sm ${
                      applicant.is_completed ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {new Date(applicant.created_at).toLocaleDateString(
                      "ko-KR",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <Button
                      onClick={() => handleComplete([applicant.id])}
                      disabled={actionLoading || applicant.is_completed}
                      variant="outline"
                      size="sm"
                      className="text-xs px-2 py-1 h-7"
                    >
                      {applicant.is_completed ? "완료됨" : "상담 완료"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이지네이션 */}
      {pagination.totalCount > 0 && (
        <div className="flex items-center justify-center mt-6 gap-2">
          <Button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            variant="outline"
            size="sm"
          >
            이전
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              page => (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  variant={
                    pagination.currentPage === page ? "default" : "outline"
                  }
                  size="sm"
                  className="w-10"
                >
                  {page}
                </Button>
              )
            )}
          </div>

          <Button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            variant="outline"
            size="sm"
          >
            다음
          </Button>
        </div>
      )}
    </>
  );
}
