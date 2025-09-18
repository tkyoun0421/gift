"use client";

import { useState, useEffect } from "react";
import api from "@/shared/lib/axios";
import { Button } from "@/shared/ui/button";

interface Applicant {
  id: string;
  name: string;
  contact: string;
  has_overseas_gift_exp: boolean;
  privacy_consent: boolean;
  marketing_consent: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const applicantsResponse = await api.get("/api/applicants");
      const applicantsData = applicantsResponse.data?.applicants || [];
      setApplicants(applicantsData);
    } catch (error) {
      console.error("신청자 목록 조회 에러:", error);
      setApplicants([]);
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-2xl font-bold text-gray-900">신청자 관리</h1>
            <p className="text-gray-500 mt-1">
              서비스 신청자들의 정보를 확인하세요
            </p>
          </div>
          <Button
            onClick={fetchApplicants}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium"
          >
            새로고침
          </Button>
        </div>

        {/* 통계 요약 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-50 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 font-medium">총 신청자</p>
                <p className="text-xl font-bold text-blue-700">
                  {applicants.length}
                </p>
              </div>
              <span className="text-blue-600 text-lg">📝</span>
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 font-medium">
                  해외선물 경험
                </p>
                <p className="text-xl font-bold text-green-700">
                  {applicants.filter(app => app.has_overseas_gift_exp).length}
                </p>
              </div>
              <span className="text-green-600 text-lg">🌍</span>
            </div>
          </div>

          <div className="bg-purple-50 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-600 font-medium">
                  개인정보 동의
                </p>
                <p className="text-xl font-bold text-purple-700">
                  {applicants.filter(app => app.privacy_consent).length}
                </p>
              </div>
              <span className="text-purple-600 text-lg">✅</span>
            </div>
          </div>

          <div className="bg-orange-50 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-orange-600 font-medium">
                  마케팅 동의
                </p>
                <p className="text-xl font-bold text-orange-700">
                  {applicants.filter(app => app.marketing_consent).length}
                </p>
              </div>
              <span className="text-orange-600 text-lg">📢</span>
            </div>
          </div>
        </div>
      </div>

      {/* 신청자 목록 */}
      {applicants.length > 0 ? (
        <div className="space-y-3">
          {applicants.map(applicant => (
            <div
              key={applicant.id}
              className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {applicant.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {applicant.name}
                    </h3>
                    <p className="text-sm text-gray-500">{applicant.contact}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(applicant.created_at).toLocaleDateString("ko-KR")}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    applicant.has_overseas_gift_exp
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {applicant.has_overseas_gift_exp
                    ? "해외선물 경험 있음"
                    : "해외선물 경험 없음"}
                </span>

                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    applicant.privacy_consent
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {applicant.privacy_consent
                    ? "개인정보 동의"
                    : "개인정보 미동의"}
                </span>

                {applicant.marketing_consent && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    마케팅 동의
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-3xl">📝</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            신청자가 없습니다
          </h3>
          <p className="text-gray-500">아직 서비스 신청자가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
