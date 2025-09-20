"use server";

import api from "@/shared/lib/axios";

export async function signOutAction(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const { data } = await api.post("/api/auth/logout");
    return { success: true, message: data?.message ?? "로그아웃되었습니다." };
  } catch (error) {
    return { success: false, message: "네트워크 오류가 발생했습니다." };
  }
}

