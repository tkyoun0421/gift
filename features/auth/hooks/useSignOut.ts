import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOutAction } from "@/features/auth/actions/signOutAction";

export function useSignOut() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const signOut = async () => {
    try {
      setIsLoading(true);
      await signOutAction();
      router.push("/login");
    } catch (error) {
      console.error("로그아웃 에러:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signOut,
    isLoading,
  };
}
