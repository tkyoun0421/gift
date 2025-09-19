"use client";

import { Button } from "@/shared/ui/button";
import { useApplicantFilters } from "@/features/applicant/hooks/useApplicantFilters";

interface Stats {
  today: number;
  pending: number;
  completed: number;
  total: number;
}

interface ApplicantFiltersProps {
  stats: Stats;
}

export default function ApplicantFilters({ stats }: ApplicantFiltersProps) {
  const { activeStatus, handleFilterChange } = useApplicantFilters();

  return (
    <div className="flex gap-2 mb-4">
      <Button
        onClick={() => handleFilterChange("all")}
        variant="outline"
        size="sm"
        className={`h-9 ${
          activeStatus === "all"
            ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
            : "hover:bg-gray-50"
        }`}
      >
        전체 ({stats.total})
      </Button>
      <Button
        onClick={() => handleFilterChange("pending")}
        variant="outline"
        size="sm"
        className={`h-9 ${
          activeStatus === "pending"
            ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
            : "hover:bg-gray-50"
        }`}
      >
        대기중 ({stats.pending})
      </Button>
      <Button
        onClick={() => handleFilterChange("completed")}
        variant="outline"
        size="sm"
        className={`h-9 ${
          activeStatus === "completed"
            ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
            : "hover:bg-gray-50"
        }`}
      >
        상담 완료 ({stats.completed})
      </Button>
    </div>
  );
}
