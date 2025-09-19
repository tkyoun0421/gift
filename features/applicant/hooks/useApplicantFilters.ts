"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function useApplicantFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 직접 현재 상태 읽기
  const activeStatus = searchParams.get("status") || "all";

  const handleFilterChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.delete("page"); // 필터 변경 시 페이지 리셋

    router.push(`/admin?${params.toString()}`);
  };

  return {
    activeStatus,
    handleFilterChange,
  };
}
