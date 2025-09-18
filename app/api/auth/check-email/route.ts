import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

function jsonBadRequest(message: string) {
  return NextResponse.json(
    { success: false, error: "BAD_REQUEST", message },
    { status: 400 }
  );
}

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email?: string };

    console.log("email: ", email);

    if (!email || typeof email !== "string")
      return jsonBadRequest("email이 필요합니다.");

    const trimmed = email.trim();
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_REGEX.test(trimmed)) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_EMAIL",
          message: "올바른 이메일 형식이 아닙니다.",
        },
        { status: 400 }
      );
    }

    const url =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

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

    const lower = trimmed.toLowerCase();
    const headers = {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    } as const;

    // 1차: email=eq 파라미터 사용
    // 앱 테이블에서 직접 중복확인 (권장)
    const qs = new URLSearchParams({
      select: "id",
      email: `eq.${lower}`,
      limit: "1",
    });
    const resp = await axios.get(`${url}/rest/v1/users?${qs.toString()}`, {
      headers,
      timeout: 10000,
      validateStatus: () => true,
    });

    if (resp.status < 200 || resp.status >= 300) {
      const errText =
        typeof resp.data === "string" ? resp.data : JSON.stringify(resp.data);
      return NextResponse.json(
        {
          success: false,
          error: "SUPABASE_ERROR",
          message: errText || "REST API 오류",
        },
        { status: resp.status }
      );
    }

    const users = Array.isArray(resp.data) ? resp.data : [];
    const exists = users.length > 0;
    return NextResponse.json({ success: true, exists }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "서버 오류" },
      { status: 500 }
    );
  }
}
