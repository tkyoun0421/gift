"use server";

import api from "@/shared/lib/axios";

export async function signUpAction(payload: {
  email: string;
  password: string;
  name: string;
  inviteCode: string;
}): Promise<{ message: string; userId?: string }> {
  const { data } = await api.post("/api/auth/signup", payload);
  return { message: data?.message ?? "가입 완료", userId: data?.userId };
}

