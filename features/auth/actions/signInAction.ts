"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { LoginSchema } from "@/features/auth/models/loginSchema";

export async function signInAction(payload: {
  email: string;
  password: string;
}): Promise<{ message: string }> {
  const parsed = LoginSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("입력값 오류");
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(error.message);
  }
  return { message: "로그인되었습니다." };
}
