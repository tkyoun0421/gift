"use server";

import { createClient } from "@/shared/lib/supabase/server";

export async function signOutAction(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "로그아웃되었습니다." };
  } catch (error) {
    return { success: false, message: "네트워크 오류가 발생했습니다." };
  }
}
