import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";
import axios from "axios";
import { SignUpInsertSchema } from "@/features/auth/models/signupSchema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SignUpInsertSchema.safeParse(body);
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
      if (isTaken) {
        return NextResponse.json(
          {
            success: false,
            error: "EMAIL_TAKEN",
            message: "이미 사용 중인 이메일입니다.",
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, error: "SIGNUP_ERROR", message: signUpError.message },
        { status: 500 }
      );
    }
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
            typeof resp.data === "string"
              ? resp.data
              : JSON.stringify(resp.data);
          console.error("users insert failed:", resp.status, bodyText);
          const bodyLower = bodyText.toLowerCase();
          if (
            resp.status === 409 ||
            bodyLower.includes("duplicate") ||
            bodyLower.includes("unique")
          ) {
            return NextResponse.json(
              {
                success: false,
                error: "EMAIL_TAKEN",
                message: "이미 사용 중인 이메일입니다.",
              },
              { status: 400 }
            );
          }
          return NextResponse.json(
            {
              success: false,
              error: "USER_TABLE_INSERT_FAILED",
              message: "앱 사용자 생성 실패",
            },
            { status: 500 }
          );
        }
      }
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
