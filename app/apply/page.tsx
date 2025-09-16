"use client";

import { useState } from "react";
import api from "@/shared/lib/axios";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    hasOverseasGiftExp: false,
    privacyConsent: false,
    marketingConsent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      await api.post("/api/applicants", formData);

      setSubmitMessage("신청이 성공적으로 완료되었습니다!");
      setFormData({
        name: "",
        contact: "",
        hasOverseasGiftExp: false,
        privacyConsent: false,
        marketingConsent: false,
      });
    } catch (error: any) {
      setSubmitMessage(
        error.response?.data?.error ||
          "신청 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.name && formData.contact && formData.privacyConsent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            해외선물 서비스 신청
          </CardTitle>
          <CardDescription className="text-gray-600">
            아래 정보를 입력하여 서비스를 신청해주세요
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이름 입력 */}
            <div className="space-y-2">
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                type="text"
                placeholder="이름을 입력해주세요"
                value={formData.name}
                onChange={e => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            {/* 연락처 입력 */}
            <div className="space-y-2">
              <Label htmlFor="contact">연락처 *</Label>
              <Input
                id="contact"
                type="text"
                placeholder="전화번호 또는 이메일을 입력해주세요"
                value={formData.contact}
                onChange={e => handleInputChange("contact", e.target.value)}
                required
              />
            </div>

            {/* 해외선물 이용경험 */}
            <div className="space-y-2">
              <Label>해외선물 이용경험</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasOverseasGiftExp"
                  checked={formData.hasOverseasGiftExp}
                  onCheckedChange={checked =>
                    handleInputChange("hasOverseasGiftExp", checked === true)
                  }
                />
                <Label
                  htmlFor="hasOverseasGiftExp"
                  className="text-sm font-normal cursor-pointer"
                >
                  해외선물 이용경험이 있습니다
                </Label>
              </div>
            </div>

            {/* 개인정보 동의 */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacyConsent"
                  checked={formData.privacyConsent}
                  onCheckedChange={checked =>
                    handleInputChange("privacyConsent", checked === true)
                  }
                  required
                />
                <Label
                  htmlFor="privacyConsent"
                  className="text-sm font-normal cursor-pointer"
                >
                  개인정보 수집 및 이용에 동의합니다 *
                </Label>
              </div>
            </div>

            {/* 마케팅 정보 활용 동의 */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketingConsent"
                  checked={formData.marketingConsent}
                  onCheckedChange={checked =>
                    handleInputChange("marketingConsent", checked === true)
                  }
                />
                <Label
                  htmlFor="marketingConsent"
                  className="text-sm font-normal cursor-pointer"
                >
                  마케팅 정보 수신에 동의합니다 (선택)
                </Label>
              </div>
            </div>

            {/* 제출 버튼 */}
            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? "신청 중..." : "신청하기"}
            </Button>

            {/* 결과 메시지 */}
            {submitMessage && (
              <div
                className={`text-center text-sm ${
                  submitMessage.includes("성공")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {submitMessage}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
