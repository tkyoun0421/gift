import api from "@/shared/lib/axios";

export async function checkEmailDuplicate(email: string): Promise<{
  available: boolean;
  message: string;
  confirmed?: boolean;
}> {
  const { data } = await api.post("/api/auth/check-email", { email });
  if (data?.success && data.exists === false) {
    return { available: true, message: "사용 가능한 이메일입니다." };
  }
  if (data?.success && data.exists === true) {
    const suffix = data?.confirmed ? "(인증 완료)" : "(이메일 인증 필요)";
    return {
      available: false,
      message: `이미 사용 중인 이메일입니다. ${suffix}`,
      confirmed: data?.confirmed,
    };
  }
  throw new Error(data?.message ?? "확인 실패");
}

export async function signup(payload: {
  email: string;
  password: string;
  name: string;
  inviteCode: string;
}): Promise<{ message: string; userId?: string }> {
  const { data } = await api.post("/api/auth/signup", payload);
  return { message: data?.message ?? "가입 완료", userId: data?.userId };
}
