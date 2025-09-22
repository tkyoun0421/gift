"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  SignUpFormValues,
  SignUpSchema,
} from "@/features/auth/models/signupSchema";
import { signUpAction } from "@/features/auth/actions/signUpAction";

export function useSignupForm() {
  const router = useRouter();
  const [isEmailDialogOpen, setIsEmailDialogOpen] = React.useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      inviteCode: "",
    },
  });

  const onSubmit = form.handleSubmit(async values => {
    try {
      const res = await signUpAction({
        email: values.email,
        password: values.password,
        name: values.name,
        inviteCode: values.inviteCode,
      });
      toast.success(res.message || "가입 완료");
      router.push("/login");
    } catch (err: any) {
      const code =
        (err?.response?.data?.error as string | undefined) ||
        (err?.code as string | undefined);
      const msg =
        err?.response?.data?.message || err?.message || "회원가입 실패";
      const isInvalidInvite =
        code === "INVALID_INVITE_CODE" ||
        (typeof msg === "string" && msg.includes("가입코드"));
      const isEmailTaken =
        code === "EMAIL_TAKEN" ||
        (typeof msg === "string" && msg.includes("이미 사용 중인 이메일"));

      if (isInvalidInvite) {
        form.setError("inviteCode", { type: "server", message: msg });
        queueMicrotask(() => {
          const el = document.getElementById("invite-code-input");
          if (el) (el as HTMLInputElement).focus();
        });
        toast.error(msg);
        router.push("/login");
        return;
      } else if (isEmailTaken) {
        form.setError("email", { type: "server", message: msg });
        queueMicrotask(() => {
          const el = document.getElementById("email-input");
          if (el) (el as HTMLInputElement).focus();
        });
        toast.error(msg);
        return;
      }
      toast.error(msg);
    }
  });

  const openEmailDialog = () => setIsEmailDialogOpen(true);
  const closeEmailDialog = () => setIsEmailDialogOpen(false);

  const confirmEmailFromDialog = (email: string) => {
    form.setValue("email", email, { shouldDirty: true, shouldValidate: true });
    closeEmailDialog();
    queueMicrotask(() => {
      const nameEl = document.getElementById("name-input");
      if (nameEl) (nameEl as HTMLInputElement).focus();
    });
  };

  return {
    form,
    isEmailDialogOpen,
    openEmailDialog,
    closeEmailDialog,
    confirmEmailFromDialog,
    onSubmit,
  } as const;
}
