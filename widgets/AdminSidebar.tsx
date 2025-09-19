"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/features/auth/ui/LogoutButton";

interface ApplicantStats {
  totalApplicants: number;
  withExperience: number;
  newApplicants: number;
}

interface User {
  id: string;
  name: string;
  role: string;
}

interface AdminSidebarProps {
  user: User;
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applicantStats, setApplicantStats] = useState<ApplicantStats>({
    totalApplicants: 0,
    withExperience: 0,
    newApplicants: 0,
  });
  const [loading, setLoading] = useState(true);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/stats");
      const data = await response.json();

      if (data.success) {
        setApplicantStats(data.applicantStats);
      }
    } catch (error) {
      console.error("통계 조회 에러:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    fetchStats();
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-900">관리자 페이지</h1>
        <div className="w-10" />
      </div>

      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex-shrink-0 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900 mb-1">
                관리자 페이지
              </h1>
              <p className="text-sm text-gray-500">시스템 관리</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-100">
          <div className="space-y-3">
            <div className="bg-green-50 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 font-medium">
                    총 신청자
                  </p>
                  <p className="text-lg font-bold text-green-700">
                    {loading ? "..." : applicantStats.totalApplicants}
                  </p>
                </div>
                <span className="text-green-600 text-sm">📝</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-medium">오늘 신청</p>
                  <p className="text-lg font-bold text-blue-700">
                    {loading ? "..." : applicantStats.newApplicants}
                  </p>
                </div>
                <span className="text-blue-600 text-sm">🆕</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-4">
          <nav className="space-y-2 flex flex-col gap-1">
            <Link href="/admin" onClick={() => setSidebarOpen(false)}>
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                  isActive("/admin")
                    ? "bg-green-50 text-green-700 font-medium"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <span className="text-lg">📝</span>
                신청자 관리
              </div>
            </Link>

            <Link href="/admin/users" onClick={() => setSidebarOpen(false)}>
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                  isActive("/admin/users")
                    ? "bg-green-50 text-green-700 font-medium"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <span className="text-lg">👑</span>
                관리자 관리
              </div>
            </Link>

            <Link
              href="/admin/invite-code"
              onClick={() => setSidebarOpen(false)}
            >
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                  isActive("/admin/invite-code")
                    ? "bg-green-50 text-green-700 font-medium"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <span className="text-lg">🔑</span>
                가입 코드 관리
              </div>
            </Link>
          </nav>
        </div>

        {/* 사용자 정보 및 액션 */}
        <div className="px-4 py-4 border-t border-gray-100 space-y-3 mt-auto">
          {user && (
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.role === "super_admin" ? "슈퍼 관리자" : "관리자"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <LogoutButton />
          </div>
        </div>
      </div>
    </>
  );
}
