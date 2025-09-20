"use server";

import { createClient } from "@/shared/lib/supabase/server";

export async function completeApplicantsServer(ids: string[]) {
  if (!Array.isArray(ids) || ids.length === 0) {
    return {
      ok: false as const,
      error: "VALIDATION_ERROR" as const,
      message: "유효한 신청자 ID가 필요합니다.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("applicants")
    .update({ is_completed: true, completed_at: new Date().toISOString() })
    .in("id", ids);

  if (error) {
    return {
      ok: false as const,
      error: "DATABASE_ERROR" as const,
      message: "상담 완료 처리에 실패했습니다.",
    };
  }

  return { ok: true as const, count: ids.length };
}
