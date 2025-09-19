import api from "@/shared/lib/axios";

export async function checkEmailDuplicate(email: string): Promise<{
  available: boolean;
  message: string;
}> {
  const { data } = await api.post("/api/auth/check-email", { email });

  if (data?.success && data.exists === false) {
    return { available: true, message: "사용 가능한 이메일입니다." };
  }
  if (data?.success && data.exists === true) {
    return {
      available: false,
      message: "이미 사용 중인 이메일입니다.",
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

export async function signIn(
  email: string,
  password: string
): Promise<{ message: string }> {
  const { data } = await api.post("/api/auth/login", { email, password });
  return { message: data?.message ?? "로그인되었습니다." };
}

export async function signOut(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const { data } = await api.post("/api/auth/logout");
    return { success: true, message: data?.message ?? "로그아웃되었습니다." };
  } catch (error) {
    console.error("로그아웃 에러:", error);
    return { success: false, message: "네트워크 오류가 발생했습니다." };
  }
}
