"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { ApplicantInsertSchema } from "@/features/applicant/models/applicantSchema";

export async function createApplicantServer(input: unknown) {
  const parsed = ApplicantInsertSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "VALIDATION_ERROR" as const,
      message: "입력값을 확인해주세요.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("applicants").insert(parsed.data);
  if (error) {
    return {
      ok: false as const,
      error: "DATABASE_ERROR" as const,
      message: "저장에 실패했습니다.",
    };
  }

  return { ok: true as const };
}
