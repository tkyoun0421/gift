import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/features/auth/services/authService";

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("로그아웃 에러:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading,
  };
}
