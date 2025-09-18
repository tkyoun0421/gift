import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, AuthUser } from "@/shared/lib/auth";
import { useState, useEffect } from "react";

// Query Keys
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  session: () => [...authKeys.all, "session"] as const,
};

/**
 * 현재 사용자 정보 조회 훅
 */
export function useUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5분
    retry: false,
  });
}

/**
 * 현재 세션 정보 조회 훅
 */
export function useSession() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: () => authService.getSession(),
    staleTime: 5 * 60 * 1000, // 5분
    retry: false,
  });
}

/**
 * 로그인 상태 확인 훅
 */
export function useAuth() {
  const { data: user, isLoading, error } = useUser();
  const { data: sessionData } = useSession();

  return {
    user: user || null,
    session: sessionData?.session || null,
    isLoading,
    isAuthenticated: !!user && !!sessionData?.session,
    error,
  };
}

/**
 * 회원가입 훅
 */
export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => authService.signUp(email, password, name),
    onSuccess: () => {
      // 사용자 정보 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}

/**
 * 로그인 훅
 */
export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signIn(email, password),
    onSuccess: () => {
      // 사용자 정보 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}

/**
 * 로그아웃 훅
 */
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      // 모든 쿼리 무효화
      queryClient.clear();
    },
  });
}

/**
 * 이메일 인증 재전송 훅
 */
export function useResendConfirmation() {
  return useMutation({
    mutationFn: (email: string) => authService.resendConfirmation(email),
  });
}

/**
 * 비밀번호 재설정 훅
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.resetPassword(email),
  });
}

/**
 * 권한 확인 훅
 */
export function usePermission(requiredRole: "user" | "admin" | "super_admin") {
  const { user } = useAuth();

  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (user) {
      authService.hasPermission(requiredRole).then(setHasPermission);
    } else {
      setHasPermission(false);
    }
  }, [user, requiredRole]);

  return hasPermission;
}

/**
 * 관리자 권한 확인 훅
 */
export function useIsAdmin() {
  return usePermission("admin");
}

/**
 * 슈퍼 관리자 권한 확인 훅
 */
export function useIsSuperAdmin() {
  return usePermission("super_admin");
}

/**
 * 인증 상태 변화 감지 훅
 */
export function useAuthStateChange() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  useEffect(() => {
    const {
      data: { subscription },
    } = authService.supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);

      // 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      queryClient.invalidateQueries({ queryKey: authKeys.session() });

      // 로그인/로그아웃 이벤트 처리
      if (event === "SIGNED_IN") {
        console.log("User signed in");
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        // 모든 쿼리 클리어
        queryClient.clear();
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  return { user };
}
