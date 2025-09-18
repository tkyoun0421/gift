"use client";

import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { LoadingSpinner } from "@/shared/ui/loading";
import useApplicantForm from "@/features/applicant/hooks/useApplicantForm";
import { useState } from "react";
import ConsentModal from "@/features/applicant/ui/ConsentModal";

export default function ApplicantForm({ className }: { className?: string }) {
  const { form, submit } = useApplicantForm();
  const [modalOpen, setModalOpen] = useState<"privacy" | "marketing" | null>(
    null
  );
  const {
    register,
    formState: { isSubmitting, errors },
  } = form;

  return (
    <form onSubmit={submit()} className={className || "space-y-6"}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label
            htmlFor="applicantName"
            className="text-white font-medium mb-2 block"
          >
            이름
          </Label>
          <Input
            id="applicantName"
            type="text"
            placeholder="이름을 입력하세요"
            className="bg-white/90 border-white/20 focus:bg-white"
            required
            {...register("name", { required: "이름은 필수값 입니다." })}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-400">
              {String(errors.name.message || "이름을 확인해주세요.")}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="applicantPhone"
            className="text-white font-medium mb-2 block"
          >
            전화번호
          </Label>
          <Input
            id="applicantPhone"
            type="tel"
            placeholder="010 포함 11자리 01012345678"
            className="bg-white/90 border-white/20 focus:bg-white"
            required
            {...register("phone", {
              required: "휴대폰 번호는 필수값 입니다.",
            })}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-400">
              {String(errors.phone.message || "전화번호를 확인해주세요.")}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label className="text-white font-medium mb-3 block">
          해외 선물 이용 경험
        </Label>
        <div className="flex space-x-6">
          <div className="flex items-center space-x-2">
            <input
              id="applicantOverseasNo"
              type="radio"
              value="false"
              defaultChecked={true}
              className="w-4 h-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-500"
              {...register("has_futures_experience", {
                setValueAs: v => v === "true",
              })}
            />
            <Label htmlFor="applicantOverseasNo" className="text-white">
              없음
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="applicantOverseasYes"
              type="radio"
              value="true"
              className="w-4 h-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-500"
              {...register("has_futures_experience", {
                setValueAs: v => v === "true",
              })}
            />
            <Label htmlFor="applicantOverseasYes" className="text-white">
              있음
            </Label>
          </div>
        </div>
        {errors.has_futures_experience && (
          <p className="mt-1 text-xs text-red-400">선택 값을 확인해주세요.</p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            id="applicantPrivacyConsent"
            type="checkbox"
            required
            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
            {...register("privacy_consent")}
          />
          <Label
            htmlFor="applicantPrivacyConsent"
            className="text-white text-sm"
          >
            개인정보수집 및 이용동의
          </Label>
          <button
            type="button"
            onClick={() => setModalOpen("privacy")}
            className="text-blue-300 text-sm underline hover:text-blue-200 ml-2"
          >
            자세히보기
          </button>
        </div>
        {errors.privacy_consent && (
          <p className="mt-1 text-xs text-red-400">
            개인정보 동의가 필요합니다.
          </p>
        )}

        <div className="flex items-center space-x-2">
          <input
            id="applicantMarketingConsent"
            type="checkbox"
            required
            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
            {...register("marketing_consent")}
          />
          <Label
            htmlFor="applicantMarketingConsent"
            className="text-white text-sm"
          >
            마케팅 정보활용 동의
          </Label>
          <button
            type="button"
            onClick={() => setModalOpen("marketing")}
            className="text-blue-300 text-sm underline hover:text-blue-200 ml-2"
          >
            자세히보기
          </button>
        </div>
      </div>

      <div className="text-center pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="w-full sm:w-auto min-w-40 bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? (
            <LoadingSpinner label="신청 중..." />
          ) : (
            "이벤트 신청하기"
          )}
        </Button>
      </div>

      {modalOpen && (
        <ConsentModal type={modalOpen} onClose={() => setModalOpen(null)} />
      )}
    </form>
  );
}
