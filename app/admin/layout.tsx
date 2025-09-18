"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import api from "@/shared/lib/axios";
import { Button } from "@/shared/ui/button";
import { useAuth, useSignOut } from "@/shared/hooks/useAuth";

interface UserStats {
  totalUsers: number;
  confirmedUsers: number;
}

interface ApplicantStats {
  totalApplicants: number;
  withExperience: number;
  newApplicants: number;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const signOutMutation = useSignOut();
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    confirmedUsers: 0,
  });
  const [applicantStats, setApplicantStats] = useState<ApplicantStats>({
    totalApplicants: 0,
    withExperience: 0,
    newApplicants: 0,
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // 사용자 통계 가져오기
      try {
        const usersResponse = await api.get("/api/users");
        const users = usersResponse.data?.users || [];

        setUserStats({
          totalUsers: users.length,
          confirmedUsers: users.filter((user: any) => user.emailConfirmed)
            .length,
        });
      } catch (userError) {
        console.error("사용자 통계 조회 에러:", userError);
        setUserStats({
          totalUsers: 0,
          confirmedUsers: 0,
        });
      }

      // 신청자 통계 가져오기
      try {
        const applicantsResponse = await api.get("/api/applicants");
        const applicantsData = applicantsResponse.data?.applicants || [];

        // 오늘 신청한 사람들 계산
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const newApplicants = applicantsData.filter((app: any) => {
          const appDate = new Date(app.created_at);
          appDate.setHours(0, 0, 0, 0);
          return appDate.getTime() === today.getTime();
        }).length;

        setApplicantStats({
          totalApplicants: applicantsData.length,
          withExperience: applicantsData.filter(
            (app: any) => app.has_overseas_gift_exp
          ).length,
          newApplicants: newApplicants,
        });
      } catch (applicantError) {
        console.error("신청자 통계 조회 에러:", applicantError);
        setApplicantStats({
          totalApplicants: 0,
          withExperience: 0,
          newApplicants: 0,
        });
      }
    } catch (error) {
      console.error("통계 조회 에러:", error);
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await signOutMutation.mutateAsync();
    } catch (error) {
      console.error("로그아웃 에러:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 사이드바 네비게이션 */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex-shrink-0 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* 헤더 */}
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900 mb-1">
                관리자 패널
              </h1>
              <p className="text-sm text-gray-500">시스템 관리</p>
            </div>
            {/* 모바일에서만 닫기 버튼 표시 */}
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
                    {applicantStats.totalApplicants}
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
                    {applicantStats.newApplicants}
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

        <div className="px-4 py-4 border-t border-gray-100 space-y-3">
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
            <Button
              onClick={fetchStats}
              variant="outline"
              className="w-full py-2 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 text-sm"
            >
              데이터 새로고침
            </Button>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full py-2 rounded-xl border-red-200 text-red-600 hover:bg-red-50 text-sm"
              disabled={signOutMutation.isPending}
            >
              {signOutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
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
          <h1 className="text-lg font-semibold text-gray-900">관리자 패널</h1>
          <div className="w-10" />
        </div>

        {children}
      </div>
    </div>
  );
}
