import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/shared/lib/supabase/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(20),
  inviteCode: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "VALIDATION_ERROR", message: "입력값 오류" },
        { status: 400 }
      );
    }

    const { email, password, name, inviteCode } = parsed.data;

    const supabase = await createClient();
    const { data: codes, error: codeError } = await supabase
      .from("invite_code")
      .select("id, code")
      .limit(1);

    if (codeError) {
      return NextResponse.json(
        { success: false, error: "DATABASE_ERROR", message: codeError.message },
        { status: 500 }
      );
    }

    const currentCode = codes?.[0]?.code;
    if (!currentCode || currentCode !== inviteCode) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_INVITE_CODE",
          message: "가입코드가 올바르지 않습니다.",
        },
        { status: 400 }
      );
    }

    // 중복 이메일 확인 (정확한 Admin API 사용)
    {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!url || !serviceRoleKey) {
        return NextResponse.json(
          {
            success: false,
            error: "SERVER_MISCONFIGURATION",
            message: "SUPABASE 설정이 누락되었습니다.",
          },
          { status: 500 }
        );
      }
      const admin = createSupabaseAdmin(url, serviceRoleKey);
      const { data, error } = await (admin.auth.admin as any).listUsers({
        page: 1,
        perPage: 1,
        filter: `email.eq.${email.toLowerCase()}`,
      });
      if (error) {
        return NextResponse.json(
          {
            success: false,
            error: "SUPABASE_ERROR",
            message: String(error?.message ?? error),
          },
          { status: 500 }
        );
      }
      const exists = Array.isArray(data?.users) && data.users.length > 0;
      if (exists) {
        const confirmed = Boolean(data.users[0]?.email_confirmed_at);
        return NextResponse.json(
          {
            success: false,
            error: "EMAIL_TAKEN",
            message: confirmed
              ? "이미 사용 중인 이메일입니다."
              : "이미 사용 중인 이메일입니다. (이메일 인증 필요)",
          },
          { status: 400 }
        );
      }
    }

    // 회원 생성
    const { data: signUpRes, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback`,
      },
    });

    if (signUpError) {
      return NextResponse.json(
        { success: false, error: "SIGNUP_ERROR", message: signUpError.message },
        { status: 500 }
      );
    }

    // 안전장치: 메타데이터가 비어있는 경우 Admin API로 보강 업데이트
    try {
      const userId = signUpRes.user?.id;
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (userId && url && serviceRoleKey) {
        const admin = createSupabaseAdmin(url, serviceRoleKey);
        await admin.auth.admin.updateUserById(userId, {
          user_metadata: { name },
        });
      }
    } catch (_) {
      // no-op: 메타데이터 보강 실패는 치명적이지 않음
    }

    return NextResponse.json(
      {
        success: true,
        userId: signUpRes.user?.id,
        message: "가입 메일을 확인해주세요.",
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "서버 오류" },
      { status: 500 }
    );
  }
}
