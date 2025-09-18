"use client";

import { Button } from "@/shared/ui/button";

export default function ConsentModal({
  type,
  onClose,
}: {
  type: "privacy" | "marketing";
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {type === "privacy"
              ? "개인정보수집 및 이용동의"
              : "마케팅 정보활용 동의"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        <div className="text-sm text-gray-700 leading-relaxed">
          {type === "privacy" ? (
            <div className="space-y-3">
              <p>
                <strong>1. 개인정보 수집 및 이용 목적</strong>
              </p>
              <p>이벤트 신청 및 관리, 참가자 확인, 안내사항 전달</p>

              <p>
                <strong>2. 수집하는 개인정보 항목</strong>
              </p>
              <p>이름, 전화번호</p>

              <p>
                <strong>3. 개인정보 보유 및 이용기간</strong>
              </p>
              <p>이벤트 종료 후 1년간 보관</p>

              <p>
                <strong>4. 개인정보 제3자 제공</strong>
              </p>
              <p>원칙적으로 제3자에게 제공하지 않습니다.</p>

              <p>
                <strong>5. 개인정보 처리의 위탁</strong>
              </p>
              <p>개인정보 처리를 위탁하지 않습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p>
                <strong>1. 마케팅 정보 수집 및 이용 목적</strong>
              </p>
              <p>이벤트 관련 정보, 혜택 안내, 새로운 서비스 소개</p>

              <p>
                <strong>2. 수집하는 마케팅 정보 항목</strong>
              </p>
              <p>이름, 전화번호, 이벤트 참여 이력</p>

              <p>
                <strong>3. 마케팅 정보 보유 및 이용기간</strong>
              </p>
              <p>동의 철회 시까지 또는 이벤트 종료 후 1년간</p>

              <p>
                <strong>4. 마케팅 정보 제공 방법</strong>
              </p>
              <p>SMS, 전화, 이메일을 통한 정보 제공</p>

              <p>
                <strong>5. 동의 철회</strong>
              </p>
              <p>언제든지 마케팅 정보 수신 동의를 철회할 수 있습니다.</p>

              <p>
                <strong>6. 선택사항</strong>
              </p>
              <p>
                마케팅 정보 수신 동의는 선택사항이며, 동의하지 않아도 이벤트
                참여가 가능합니다.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}
