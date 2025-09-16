"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Label } from "@/shared/ui/label";
import { createClient } from "@/shared/lib/supabase/client";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    inviteCode: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setErrorMessage(""); // 입력 시 에러 메시지 초기화
  };

  const validateForm = () => {
    if (
      !formData.email ||
      !formData.password ||
      !formData.name ||
      !formData.inviteCode
    ) {
      setErrorMessage("모든 필드를 입력해주세요.");
      return false;
    }

    // 이메일 형식 검증
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("올바른 이메일 형식을 입력해주세요.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return false;
    }

    if (formData.password.length < 6) {
      setErrorMessage("비밀번호는 최소 6자 이상이어야 합니다.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // 가입 코드 검증
      try {
        await api.post("/api/invite-codes/validate", {
          code: formData.inviteCode,
        });
      } catch (error: any) {
        setErrorMessage(
          error.response?.data?.error || "가입 코드가 유효하지 않습니다."
        );
        return;
      }

      // Supabase 회원가입
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (data.user) {
        console.log("회원가입된 사용자 정보:", data.user);
        console.log("사용자 메타데이터:", data.user.user_metadata);

        // 가입 코드 사용 처리
        await api.post("/api/invite-codes/use", {
          code: formData.inviteCode,
        });

        alert(
          "회원가입이 완료되었습니다! 이메일을 확인하여 계정을 활성화해주세요."
        );
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      setErrorMessage("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            관리자 회원가입
          </CardTitle>
          <CardDescription className="text-gray-600">
            가입 코드가 필요합니다
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 가입 코드 */}
            <div className="space-y-2">
              <Label htmlFor="inviteCode">가입 코드 *</Label>
              <Input
                id="inviteCode"
                type="text"
                placeholder="가입 코드를 입력해주세요"
                value={formData.inviteCode}
                onChange={e => handleInputChange("inviteCode", e.target.value)}
                required
              />
            </div>

            {/* 이름 */}
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

            {/* 이메일 */}
            <div className="space-y-2">
              <Label htmlFor="email">이메일 *</Label>
              <Input
                id="email"
                type="email"
                placeholder="이메일을 입력해주세요"
                value={formData.email}
                onChange={e => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            {/* 비밀번호 */}
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호 *</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력해주세요 (최소 6자)"
                value={formData.password}
                onChange={e => handleInputChange("password", e.target.value)}
                required
              />
            </div>

            {/* 비밀번호 확인 */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인 *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력해주세요"
                value={formData.confirmPassword}
                onChange={e =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                required
              />
            </div>

            {/* 제출 버튼 */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "가입 중..." : "회원가입"}
            </Button>

            {/* 에러 메시지 */}
            {errorMessage && (
              <div className="text-center text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            {/* 로그인 링크 */}
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => router.push("/auth/login")}
                className="text-sm"
              >
                이미 계정이 있으신가요? 로그인하기
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
