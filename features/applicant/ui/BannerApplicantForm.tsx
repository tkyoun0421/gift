"use client";

import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { useApplicantForm } from "../hooks/useApplicantForm";
import { useState } from "react";
import ConsentModal from "@/features/applicant/ui/ConsentModal";
import { LoadingSpinner } from "@/shared/ui/loading";

export default function BannerApplicantForm({
  className,
}: {
  className?: string;
}) {
  const { form, submit } = useApplicantForm();
  const [modalOpen, setModalOpen] = useState<"privacy" | "marketing" | null>(
    null
  );
  const {
    register,
    formState: { isSubmitting, errors },
  } = form;

  return (
    <form onSubmit={submit()} className={className || "space-y-2 md:space-y-3"}>
      <div className="flex gap-2 md:gap-4">
        <div className="flex-1">
          <Label
            htmlFor="bannerApplicantName"
            className="text-white font-medium"
          >
            이름
          </Label>
          <Input
            id="bannerApplicantName"
            type="text"
            placeholder="홍길동"
            className="mt-1 bg-white/90 border-white/20 focus:bg-white"
            {...register("name", { required: "이름을 입력하세요." })}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-400">
              {String(errors.name.message || "이름을 확인해주세요.")}
            </p>
          )}
          <div className="flex items-center space-x-1 md:space-x-2 mt-1 md:mt-2">
            <input
              id="bannerApplicantPrivacyConsent"
              type="checkbox"
              className="w-3 h-3 md:w-4 md:h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
              required
              {...register("privacy_consent", {
                required: "개인정보 동의가 필요합니다.",
              })}
            />
            <Label
              htmlFor="bannerApplicantPrivacyConsent"
              className="text-white text-xs md:text-xs"
            >
              <span className="hidden sm:inline">개인정보수집 및 이용동의</span>
              <span className="sm:hidden">개인정보동의</span>
            </Label>
            <button
              type="button"
              onClick={() => setModalOpen("privacy")}
              className="text-blue-300 text-xs underline hover:text-blue-200 ml-1 md:ml-2"
            >
              <span className="hidden sm:inline">자세히보기</span>
              <span className="sm:hidden">보기</span>
            </button>
          </div>
          {errors.privacy_consent && (
            <p className="mt-1 text-xs text-red-400">
              개인정보 동의가 필요합니다.
            </p>
          )}
        </div>

        <div className="flex-1">
          <Label
            htmlFor="bannerApplicantPhone"
            className="text-white font-medium"
          >
            전화번호
          </Label>
          <Input
            id="bannerApplicantPhone"
            type="tel"
            placeholder="010 포함 11자리 01012345678"
            className="mt-1 bg-white/90 border-white/20 focus:bg-white"
            {...register("phone", { required: "전화번호를 입력하세요." })}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-400">
              {String(errors.phone.message || "전화번호를 확인해주세요.")}
            </p>
          )}
          <div className="flex items-center space-x-1 md:space-x-2 mt-1 md:mt-2">
            <input
              id="bannerApplicantMarketingConsent"
              type="checkbox"
              className="w-3 h-3 md:w-4 md:h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
              required
              {...register("marketing_consent", {
                required: "마케팅 정보 동의가 필요합니다.",
              })}
            />
            <Label
              htmlFor="bannerApplicantMarketingConsent"
              className="text-white text-xs md:text-xs"
            >
              <span className="hidden sm:inline">마케팅 정보활용 동의</span>
              <span className="sm:hidden">마케팅동의</span>
            </Label>
            <button
              type="button"
              onClick={() => setModalOpen("marketing")}
              className="text-blue-300 text-xs underline hover:text-blue-200 ml-1 md:ml-2"
            >
              <span className="hidden sm:inline">자세히보기</span>
              <span className="sm:hidden">보기</span>
            </button>
          </div>
          {errors.marketing_consent && (
            <p className="mt-1 text-xs text-red-400">
              마케팅 정보 동의가 필요합니다.
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 px-4 md:py-4 md:px-6 lg:py-6 lg:px-8 xl:py-8 xl:px-12 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl flex-shrink-0 text-sm md:text-sm lg:text-base xl:text-lg h-full relative"
        >
          <span className={isSubmitting ? "invisible" : "visible"}>
            이벤트 신청하기
          </span>
          {isSubmitting && (
            <span className="absolute inset-0 grid place-items-center">
              <LoadingSpinner label="신청 중..." />
            </span>
          )}
        </Button>
      </div>
      {modalOpen && (
        <ConsentModal type={modalOpen} onClose={() => setModalOpen(null)} />
      )}
    </form>
  );
}
