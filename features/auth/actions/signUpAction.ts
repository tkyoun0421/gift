"use server";

import { createClient } from "@/shared/lib/supabase/server";
import axios from "axios";
import { SignUpInsertSchema } from "@/features/auth/models/signupSchema";

export async function signUpAction(payload: {
  email: string;
  password: string;
  name: string;
  inviteCode: string;
}): Promise<{ message: string; userId?: string }> {
  const parsed = SignUpInsertSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("입력값 오류");
  }

  const { email, password, name, inviteCode } = parsed.data;

  const supabase = await createClient();

  // 1) 초대코드 확인
  const { data: codes, error: codeError } = await supabase
    .from("invite_code")
    .select("id, code")
    .limit(1);
  if (codeError) {
    throw new Error(codeError.message);
  }
  const currentCode = codes?.[0]?.code;
  if (!currentCode || currentCode !== inviteCode) {
    const err = new Error("가입코드가 올바르지 않습니다.") as any;
    err.code = "INVALID_INVITE_CODE";
    throw err;
  }

  // 2) 회원가입
  const { data: signUpRes, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback`,
    },
  });
  if (signUpError) {
    const msg = (signUpError?.message || "").toLowerCase();
    const isTaken =
      (signUpError as any)?.status === 422 ||
      msg.includes("already") ||
      msg.includes("exist") ||
      msg.includes("registered");
    const err = new Error(
      isTaken ? "이미 사용 중인 이메일입니다." : signUpError.message
    ) as any;
    if (isTaken) err.code = "EMAIL_TAKEN";
    throw err;
  }

  // 3) users 테이블 insert (서비스 롤 키)
  {
    const url =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
    if (url && serviceRoleKey && signUpRes.user?.id) {
      const payload = {
        id: signUpRes.user.id,
        email: email.toLowerCase(),
        name,
        role: "member",
        created_at: new Date().toISOString(),
      } as const;
      const resp = await axios.post(`${url}/rest/v1/users`, payload, {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
        validateStatus: () => true,
      });
      if (resp.status >= 300) {
        const bodyText =
          typeof resp.data === "string" ? resp.data : JSON.stringify(resp.data);
        const bodyLower = bodyText.toLowerCase();
        if (
          resp.status === 409 ||
          bodyLower.includes("duplicate") ||
          bodyLower.includes("unique")
        ) {
          const err = new Error("이미 사용 중인 이메일입니다.") as any;
          err.code = "EMAIL_TAKEN";
          throw err;
        }
        throw new Error("앱 사용자 생성 실패");
      }
    }
  }

  return { message: "가입 메일을 확인해주세요.", userId: signUpRes.user?.id };
}
