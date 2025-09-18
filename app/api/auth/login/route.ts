import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/shared/lib/supabase/server";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "VALIDATION_ERROR", message: "입력값 오류" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: "LOGIN_FAILED", message: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: true, message: "로그인되었습니다.", userId: data.user?.id },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "서버 오류" },
      { status: 500 }
    );
  }
}
