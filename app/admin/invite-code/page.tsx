"use client";

import { useState, useEffect } from "react";
import api from "@/shared/lib/axios";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

interface InviteCode {
  id: string;
  code: string;
  created_at: string;
  used_count?: number;
  last_used_at?: string;
}

export default function InviteCodePage() {
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCode, setNewCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCode, setEditingCode] = useState("");

  useEffect(() => {
    fetchInviteCodes();
  }, []);

  const fetchInviteCodes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/invite-codes");
      setInviteCodes(response.data?.inviteCodes || []);
    } catch (error: any) {
      console.error("가입 코드 목록 조회 에러:", error);
      setError("가입 코드 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    try {
      setIsCreating(true);
      setError("");

      await api.post("/api/invite-codes", {
        code: newCode.trim(),
      });

      setNewCode("");
      await fetchInviteCodes();
    } catch (error: any) {
      console.error("가입 코드 생성 에러:", error);
      setError(error.response?.data?.error || "가입 코드 생성에 실패했습니다.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditCode = (inviteCode: InviteCode) => {
    setEditingCode(inviteCode.code);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingCode.trim() || inviteCodes.length === 0) return;

    try {
      await api.put("/api/invite-codes", {
        id: inviteCodes[0].id,
        code: editingCode.trim(),
      });
      setIsModalOpen(false);
      setEditingCode("");
      await fetchInviteCodes();
    } catch (error: any) {
      console.error("가입 코드 수정 에러:", error);
      setError("가입 코드 수정에 실패했습니다.");
    }
  };

  const handleCancelEdit = () => {
    setIsModalOpen(false);
    setEditingCode("");
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              가입 코드 관리
            </h2>
            <p className="text-gray-500 mt-1">
              회원가입에 사용할 코드를 관리하세요.
            </p>
          </div>
          <Button
            onClick={fetchInviteCodes}
            variant="outline"
            className="px-4 py-2 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            새로고침
          </Button>
        </div>

        {/* 가입 코드 관리 */}
        {inviteCodes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">🔑</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              가입 코드를 생성하세요
            </h3>
            <p className="text-gray-500 mb-6">
              회원가입에 사용할 코드를 입력해주세요
            </p>

            <form onSubmit={handleCreateCode} className="max-w-md mx-auto">
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="예: 이재경"
                  value={newCode}
                  onChange={e => setNewCode(e.target.value)}
                  className="flex-1 text-center text-lg font-medium border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <Button
                  type="submit"
                  disabled={isCreating || !newCode.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium"
                >
                  {isCreating ? "생성 중..." : "생성"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-2">현재 가입 코드</div>
              <div className="max-w-md mx-auto">
                <div className="text-3xl font-bold text-gray-900 bg-gray-50 px-6 py-4 rounded-2xl border-2 border-gray-200 mb-4">
                  {inviteCodes[0].code}
                </div>
                <Button
                  onClick={() => handleEditCode(inviteCodes[0])}
                  variant="outline"
                  className="px-6 py-2 rounded-xl border-gray-200 hover:bg-gray-50"
                >
                  코드 변경
                </Button>
              </div>
            </div>
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

        {/* 안내 메모 */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 text-sm">💡</span>
            </div>
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">안내</p>
              <ul className="space-y-1 text-blue-600">
                <li>• 가입 코드는 대소문자를 구분합니다</li>
                <li>• 코드 변경 시 기존 사용자에게 영향을 주지 않습니다</li>
                <li>• 사용 횟수는 계속 누적됩니다</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 수정 모달 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-end justify-center z-50">
            <div className="bg-white rounded-t-3xl w-full max-w-md animate-slide-up">
              {/* 모달 헤더 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  가입 코드 변경
                </h2>
                <button
                  onClick={handleCancelEdit}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-400 text-xl">×</span>
                </button>
              </div>

              {/* 모달 내용 */}
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    새로운 가입 코드
                  </label>
                  <Input
                    value={editingCode}
                    onChange={e => setEditingCode(e.target.value)}
                    placeholder="가입 코드를 입력하세요"
                    className="w-full text-center text-lg font-medium border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                    autoFocus
                  />
                </div>

                <div className="text-xs text-gray-500 mb-6 text-center">
                  가입 코드는 대소문자를 구분합니다
                </div>

                {/* 버튼 영역 */}
                <div className="space-y-3">
                  <Button
                    onClick={handleSaveEdit}
                    disabled={!editingCode.trim()}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium text-base disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    변경하기
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="w-full py-3 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    취소
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
