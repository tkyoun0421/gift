"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LoginInsertType,
  LoginSchema,
} from "@/features/auth/models/loginSchema";
import { signInAction } from "@/features/auth/actions/signInAction";

export function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<LoginInsertType>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async values => {
    try {
      const res = await signInAction({
        email: values.email,
        password: values.password,
      });
      toast.success(res.message ?? "로그인되었습니다.");

      const callbackUrl = searchParams.get("callback");
      const redirectUrl = callbackUrl || "/";
      router.push(redirectUrl);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "로그인 실패";
      toast.error(msg);
      const el = document.getElementById("email-input");
      if (el) (el as HTMLInputElement).focus();
    }
  });

  return { form, onSubmit } as const;
}
