"use server";

import api from "@/shared/lib/axios";

export async function checkEmailDuplicateAction(email: string): Promise<{
  available: boolean;
  message: string;
}> {
  const { data } = await api.post("/api/auth/check-email", { email });
  if (data?.success && data.exists === false) {
    return { available: true, message: "사용 가능한 이메일입니다." };
  }
  if (data?.success && data.exists === true) {
    return { available: false, message: "이미 사용 중인 이메일입니다." };
  }
  throw new Error(data?.message ?? "확인 실패");
}

