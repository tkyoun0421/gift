"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  LoginFormValues,
  LoginSchema,
} from "@/features/auth/models/loginSchema";
import { signIn } from "@/features/auth/services/authService";

export function useLoginForm() {
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async values => {
    try {
      const res = await signIn(values.email, values.password);
      toast.success(res.message ?? "로그인되었습니다.");
      router.push("/");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "로그인 실패";
      toast.error(msg);
      const el = document.getElementById("email-input");
      if (el) (el as HTMLInputElement).focus();
    }
  });

  return { form, onSubmit } as const;
}
