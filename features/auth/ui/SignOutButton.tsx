"use client";

import { useSignOut } from "@/features/auth/hooks/useSignOut";
import { Button } from "@/shared/ui/button";

export default function SignOutButton() {
  const { signOut, isLoading } = useSignOut();

  return (
    <Button
      onClick={signOut}
      variant="outline"
      className="w-full py-2 rounded-xl text-sm"
      disabled={isLoading}
    >
      {isLoading ? "로그아웃 중..." : "로그아웃"}
    </Button>
  );
}
