import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

function jsonBadRequest(message: string) {
  return NextResponse.json(
    { success: false, error: "BAD_REQUEST", message },
    { status: 400 }
  );
}

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email?: string };
    if (!email || typeof email !== "string") {
      return jsonBadRequest("email이 필요합니다.");
    }

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
    const lower = email.toLowerCase();
    const { data, error } = await (admin.auth.admin as any).listUsers({
      page: 1,
      perPage: 1,
      filter: `email.eq.${lower}`,
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
    const confirmed = exists
      ? Boolean(data.users[0]?.email_confirmed_at)
      : false;
    return NextResponse.json(
      { success: true, exists, confirmed },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "서버 오류" },
      { status: 500 }
    );
  }
}
