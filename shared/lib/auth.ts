import { createClient } from "@/shared/lib/supabase/client";
import { User } from "@/shared/types/database";

export interface AuthUser extends User {
  session?: any;
}

export class AuthService {
  private supabase = createClient();

  /**
   * 현재 로그인된 사용자 정보 조회
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const {
        data: { user },
        error,
      } = await this.supabase.auth.getUser();

      if (error || !user) {
        return null;
      }

      // 사용자 상세 정보 조회
      const { data: userData, error: userError } = await this.supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userError || !userData) {
        return null;
      }

      return userData;
    } catch (error) {
      console.error("사용자 정보 조회 에러:", error);
      return null;
    }
  }

  /**
   * 현재 세션 정보 조회
   */
  async getSession() {
    try {
      const {
        data: { session },
        error,
      } = await this.supabase.auth.getSession();
      return { session, error };
    } catch (error) {
      console.error("세션 조회 에러:", error);
      return { session: null, error };
    }
  }

  /**
   * 회원가입
   */
  async signUp(email: string, password: string, name: string) {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          confirmPassword: password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Supabase 클라이언트 세션 업데이트
        await this.supabase.auth.setSession(result.data.session);
      }

      return result;
    } catch (error) {
      console.error("회원가입 에러:", error);
      return {
        success: false,
        error: "NETWORK_ERROR",
        message: "네트워크 오류가 발생했습니다.",
      };
    }
  }

  /**
   * 로그인
   */
  async signIn(email: string, password: string) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        // Supabase 클라이언트 세션 업데이트
        await this.supabase.auth.setSession(result.data.session);
      }

      return result;
    } catch (error) {
      console.error("로그인 에러:", error);
      return {
        success: false,
        error: "NETWORK_ERROR",
        message: "네트워크 오류가 발생했습니다.",
      };
    }
  }

  /**
   * 로그아웃
   */
  async signOut() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const result = await response.json();

      // Supabase 클라이언트에서 로그아웃
      await this.supabase.auth.signOut();

      return result;
    } catch (error) {
      console.error("로그아웃 에러:", error);
      return {
        success: false,
        error: "NETWORK_ERROR",
        message: "네트워크 오류가 발생했습니다.",
      };
    }
  }

  /**
   * 이메일 인증 재전송
   */
  async resendConfirmation(email: string) {
    try {
      const { error } = await this.supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) {
        return {
          success: false,
          error: "AUTH_ERROR",
          message: error.message,
        };
      }

      return {
        success: true,
        message: "인증 이메일이 전송되었습니다.",
      };
    } catch (error) {
      console.error("인증 이메일 재전송 에러:", error);
      return {
        success: false,
        error: "NETWORK_ERROR",
        message: "네트워크 오류가 발생했습니다.",
      };
    }
  }

  /**
   * 비밀번호 재설정 이메일 전송
   */
  async resetPassword(email: string) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        return {
          success: false,
          error: "AUTH_ERROR",
          message: error.message,
        };
      }

      return {
        success: true,
        message: "비밀번호 재설정 이메일이 전송되었습니다.",
      };
    } catch (error) {
      console.error("비밀번호 재설정 에러:", error);
      return {
        success: false,
        error: "NETWORK_ERROR",
        message: "네트워크 오류가 발생했습니다.",
      };
    }
  }

  /**
   * 권한 확인
   */
  async hasPermission(
    requiredRole: "user" | "admin" | "super_admin"
  ): Promise<boolean> {
    const user = await this.getCurrentUser();
    if (!user) return false;

    const roleHierarchy = {
      user: 1,
      admin: 2,
      super_admin: 3,
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }

  /**
   * 관리자 권한 확인
   */
  async isAdmin(): Promise<boolean> {
    return this.hasPermission("admin");
  }

  /**
   * 슈퍼 관리자 권한 확인
   */
  async isSuperAdmin(): Promise<boolean> {
    return this.hasPermission("super_admin");
  }
}

// 싱글톤 인스턴스
export const authService = new AuthService();
