"use client";

import { Button } from "@/shared/ui/button";
import { useLogout } from "@/features/auth/hooks/useLogout";

export default function LogoutButton() {
  const { logout, isLoading } = useLogout();

  return (
    <Button
      onClick={logout}
      variant="outline"
      className="w-full py-2 rounded-xl text-sm"
      disabled={isLoading}
    >
      {isLoading ? "로그아웃 중..." : "로그아웃"}
    </Button>
  );
}
