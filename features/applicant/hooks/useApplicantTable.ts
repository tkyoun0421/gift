"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import api from "@/shared/lib/axios";

interface Applicant {
  id: string;
  name: string;
  phone: string;
  has_futures_experience: boolean;
  is_completed?: boolean;
  completed_at?: string;
  created_at: string;
}

export function useApplicantTable(initialApplicants: Applicant[]) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [applicants, setApplicants] = useState(initialApplicants);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // props가 변경될 때 상태 업데이트
  useEffect(() => {
    setApplicants(initialApplicants);
    setSelectedIds([]); // 새 데이터 로드 시 선택 초기화
  }, [initialApplicants]);

  // URL 파라미터 변경 감지하여 데이터 다시 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const params = new URLSearchParams({
          page: searchParams.get("page") || "1",
          limit: "30",
          status: searchParams.get("status") || "all",
        });

        const response = await api.get(`/api/applicant/list?${params}`);
        const data = response.data;

        if (data.success) {
          setApplicants(data.applicants || []);
          setSelectedIds([]);
        }
      } catch (error) {
        console.error("데이터 로드 에러:", error);
        toast.error("데이터를 불러오는데 실패했습니다.");
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  // 페이지 변경
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/admin?${params.toString()}`);
  };

  // 체크박스 전체 선택/해제
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(applicants.map(app => app.id));
    } else {
      setSelectedIds([]);
    }
  };

  // 개별 체크박스 선택/해제
  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  // 상담 완료 처리
  const handleComplete = async (ids?: string[]) => {
    const targetIds = ids || selectedIds;
    if (targetIds.length === 0) {
      toast.error("상담 완료 처리할 신청자를 선택해주세요.");
      return;
    }

    try {
      setActionLoading(true);
      await api.patch(`/api/applicant/complete?ids=${targetIds.join(",")}`);

      // 클라이언트에서 상태 업데이트
      setApplicants(prev =>
        prev.map(app =>
          targetIds.includes(app.id)
            ? {
                ...app,
                is_completed: true,
                completed_at: new Date().toISOString(),
              }
            : app
        )
      );

      toast.success(`${targetIds.length}명의 상담이 완료 처리되었습니다.`);
      if (!ids) setSelectedIds([]);

      // Server Component 데이터 갱신
      router.refresh();

      // 사이드바 갱신을 위한 커스텀 이벤트 발생
      window.dispatchEvent(new CustomEvent("applicantDataChanged"));
    } catch (error) {
      console.error("상담 완료 처리 에러:", error);
      toast.error("상담 완료 처리에 실패했습니다.");
    } finally {
      setActionLoading(false);
    }
  };

  // 신청자 삭제
  const handleDelete = async (ids?: string[]) => {
    const targetIds = ids || selectedIds;
    if (targetIds.length === 0) {
      toast.error("삭제할 신청자를 선택해주세요.");
      return;
    }

    if (!confirm(`선택한 ${targetIds.length}명의 신청자를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      setActionLoading(true);
      await api.delete(`/api/applicant/delete?ids=${targetIds.join(",")}`);

      // 클라이언트에서 상태 업데이트
      setApplicants(prev => prev.filter(app => !targetIds.includes(app.id)));

      toast.success(`${targetIds.length}명의 신청자가 삭제되었습니다.`);
      if (!ids) setSelectedIds([]);

      // Server Component 데이터 갱신
      router.refresh();

      // 사이드바 갱신을 위한 커스텀 이벤트 발생
      window.dispatchEvent(new CustomEvent("applicantDataChanged"));
    } catch (error) {
      console.error("신청자 삭제 에러:", error);
      toast.error("신청자 삭제에 실패했습니다.");
    } finally {
      setActionLoading(false);
    }
  };

  return {
    applicants,
    selectedIds,
    actionLoading,
    dataLoading,
    handlePageChange,
    handleSelectAll,
    handleSelectItem,
    handleComplete,
    handleDelete,
  };
}
