"use server";

import api from "@/shared/lib/axios";

export async function signInAction(payload: {
  email: string;
  password: string;
}): Promise<{ message: string }> {
  const { data } = await api.post("/api/auth/login", payload);
  return { message: data?.message ?? "로그인되었습니다." };
}

