"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  SignUpFormValues,
  SignUpSchema,
} from "@/features/auth/models/signupSchema";
import { signup as signupService } from "@/features/auth/services/authService";

export function useSignupForm() {
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
      const res = await signupService({
        email: values.email,
        password: values.password,
        name: values.name,
        inviteCode: values.inviteCode,
      });
      toast.success(res.message);
    } catch (err: any) {
      const code = err?.response?.data?.error as string | undefined;
      const msg = err?.response?.data?.message ?? "회원가입 실패";
      if (code === "INVALID_INVITE_CODE") {
        form.setError("inviteCode", { type: "server", message: msg });
        queueMicrotask(() => {
          const el = document.getElementById("invite-code-input");
          if (el) (el as HTMLInputElement).focus();
        });
        return;
      } else if (code === "EMAIL_TAKEN") {
        form.setError("email", { type: "server", message: msg });
        queueMicrotask(() => {
          const el = document.getElementById("email-input");
          if (el) (el as HTMLInputElement).focus();
        });
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
