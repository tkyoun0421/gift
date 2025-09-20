"use server";

import { createClient } from "@/shared/lib/supabase/server";

export async function deleteApplicantsServer(ids: string[]) {
  if (!Array.isArray(ids) || ids.length === 0) {
    return {
      ok: false as const,
      error: "VALIDATION_ERROR" as const,
      message: "유효한 신청자 ID가 필요합니다.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("applicants").delete().in("id", ids);
  if (error) {
    return {
      ok: false as const,
      error: "DATABASE_ERROR" as const,
      message: "신청자 삭제에 실패했습니다.",
    };
  }

  return { ok: true as const, count: ids.length };
}
