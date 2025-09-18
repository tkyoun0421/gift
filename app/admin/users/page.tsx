"use client";

import { useState, useEffect } from "react";
import api from "@/shared/lib/axios";
import { Button } from "@/shared/ui/button";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  emailConfirmed: boolean;
  lastSignIn: string | null;
  role: "user" | "admin" | "super_admin";
  isActive: boolean;
}

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/users");
      // 임시로 모든 사용자를 관리자로 표시 (실제로는 role 필드가 있어야 함)
      const adminUsers = (response.data.users || []).map((user: any) => ({
        ...user,
        role: "admin" as const,
        isActive: true,
      }));
      setAdmins(adminUsers);
    } catch (error: any) {
      console.error("관리자 목록 조회 에러:", error);
      setError("관리자 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (
    userId: string,
    newRole: "user" | "admin" | "super_admin"
  ) => {
    try {
      setActionLoading(userId);
      // TODO: API 호출로 역할 변경
      await api.put(`/api/users/${userId}/role`, { role: newRole });
      await fetchAdmins();
    } catch (error: any) {
      console.error("역할 변경 에러:", error);
      setError("역할 변경에 실패했습니다.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeactivate = async (userId: string) => {
    try {
      setActionLoading(userId);
      // TODO: API 호출로 계정 비활성화
      await api.put(`/api/users/${userId}/deactivate`);
      await fetchAdmins();
    } catch (error: any) {
      console.error("계정 비활성화 에러:", error);
      setError("계정 비활성화에 실패했습니다.");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">관리자 관리</h1>
            <p className="text-gray-500 mt-1">
              관리자 권한과 계정 상태를 관리하세요
            </p>
          </div>
          <Button
            onClick={fetchAdmins}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium"
          >
            새로고침
          </Button>
        </div>

        {/* 관리자 통계 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-50 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 font-medium">총 관리자</p>
                <p className="text-xl font-bold text-blue-700">
                  {admins.length}
                </p>
              </div>
              <span className="text-blue-600 text-lg">👥</span>
            </div>
          </div>

          <div className="bg-purple-50 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-600 font-medium">
                  슈퍼어드민
                </p>
                <p className="text-xl font-bold text-purple-700">
                  {admins.filter(admin => admin.role === "super_admin").length}
                </p>
              </div>
              <span className="text-purple-600 text-lg">👑</span>
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 font-medium">일반어드민</p>
                <p className="text-xl font-bold text-green-700">
                  {admins.filter(admin => admin.role === "admin").length}
                </p>
              </div>
              <span className="text-green-600 text-lg">🛡️</span>
            </div>
          </div>

          <div className="bg-orange-50 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-orange-600 font-medium">활성 계정</p>
                <p className="text-xl font-bold text-orange-700">
                  {admins.filter(admin => admin.isActive).length}
                </p>
              </div>
              <span className="text-orange-600 text-lg">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* 관리자 목록 */}
      {admins.length > 0 ? (
        <div className="space-y-3">
          {admins.map(admin => (
            <div
              key={admin.id}
              className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {admin.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {admin.name}
                    </h3>
                    <p className="text-sm text-gray-500">{admin.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      admin.role === "super_admin"
                        ? "bg-purple-100 text-purple-800"
                        : admin.role === "admin"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {admin.role === "super_admin"
                      ? "슈퍼어드민"
                      : admin.role === "admin"
                        ? "어드민"
                        : "사용자"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(admin.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span
                    className={`flex items-center gap-1 ${
                      admin.emailConfirmed ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <span>{admin.emailConfirmed ? "✅" : "❌"}</span>
                    이메일 {admin.emailConfirmed ? "확인됨" : "미확인"}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>{admin.isActive ? "✅" : "❌"}</span>
                    계정 {admin.isActive ? "활성" : "비활성"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* 역할 변경 드롭다운 */}
                  <select
                    value={admin.role}
                    onChange={e =>
                      handleRoleChange(admin.id, e.target.value as any)
                    }
                    disabled={actionLoading === admin.id}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
                  >
                    <option value="user">사용자</option>
                    <option value="admin">어드민</option>
                    <option value="super_admin">슈퍼어드민</option>
                  </select>

                  {/* 계정 비활성화 버튼 */}
                  <Button
                    onClick={() => handleDeactivate(admin.id)}
                    disabled={actionLoading === admin.id}
                    variant="outline"
                    className="text-xs px-3 py-1 rounded-lg border-red-200 text-red-600 hover:bg-red-50"
                  >
                    {actionLoading === admin.id ? "처리중..." : "탈퇴"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-3xl">👥</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            관리자가 없습니다
          </h3>
          <p className="text-gray-500">아직 등록된 관리자가 없습니다.</p>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm">⚠️</span>
            </div>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
