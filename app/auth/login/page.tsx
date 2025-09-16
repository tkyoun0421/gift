"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrorMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (data.user) {
        console.log("사용자 정보:", data.user);
        console.log("사용자 메타데이터:", data.user.user_metadata);
        alert("로그인이 완료되었습니다!");
        router.push("/"); // 홈페이지로 리다이렉트
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      setErrorMessage("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            관리자 로그인
          </CardTitle>
          <CardDescription className="text-gray-600">
            이메일과 비밀번호를 입력해주세요
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="비밀번호를 입력해주세요"
                value={formData.password}
                onChange={e => handleInputChange("password", e.target.value)}
                required
              />
            </div>

            {/* 로그인 버튼 */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "로그인 중..." : "로그인"}
            </Button>

            {/* 에러 메시지 */}
            {errorMessage && (
              <div className="text-center text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            {/* 회원가입 링크 */}
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => router.push("/auth/register")}
                className="text-sm"
              >
                계정이 없으신가요? 회원가입하기
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
