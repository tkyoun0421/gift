"use server";

import axios from "axios";

export async function checkEmailDuplicateAction(email: string): Promise<{
  available: boolean;
  message: string;
}> {
  const trimmed = (email || "").trim();
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
    return { available: false, message: "올바른 이메일 형식이 아닙니다." };
  }

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE 설정이 누락되었습니다.");
  }

  const qs = new URLSearchParams({
    select: "id",
    email: `eq.${trimmed.toLowerCase()}`,
    limit: "1",
  });
  const resp = await axios.get(`${url}/rest/v1/users?${qs.toString()}`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    timeout: 10000,
    validateStatus: () => true,
  });

  if (resp.status < 200 || resp.status >= 300) {
    const errText =
      typeof resp.data === "string" ? resp.data : JSON.stringify(resp.data);
    throw new Error(errText || "REST API 오류");
  }

  const users = Array.isArray(resp.data) ? resp.data : [];
  const exists = users.length > 0;
  return exists
    ? { available: false, message: "이미 사용 중인 이메일입니다." }
    : { available: true, message: "사용 가능한 이메일입니다." };
}
