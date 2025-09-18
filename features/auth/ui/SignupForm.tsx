"use client";

import * as React from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import EmailCheckDialog from "./EmailCheckDialog";
import { checkEmailDuplicate } from "@/features/auth/services/authService";
import { useSignupForm } from "@/features/auth/hooks/useSignupForm";

export default function SignupForm() {
  const {
    form,
    isEmailDialogOpen,
    openEmailDialog,
    closeEmailDialog,
    confirmEmailFromDialog,
    onSubmit,
  } = useSignupForm();

  return (
    <div className="mx-auto flex min-h-[80dvh] max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">회원가입</CardTitle>
          <CardDescription>관리자 회원가입</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email-input">이메일</Label>
            <div className="flex items-center gap-2">
              <Input
                id="email-input"
                placeholder="admin@example.com"
                value={form.watch("email")}
                readOnly
                className="flex-1 h-10"
                onFocus={openEmailDialog}
              />
              <Button
                type="button"
                variant="outline"
                className="h-10 px-4"
                onClick={openEmailDialog}
              >
                중복 확인
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name-input">이름</Label>
            <Input
              id="name-input"
              placeholder="이름"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password-input">비밀번호</Label>
            <Input
              id="password-input"
              type="password"
              placeholder="최소 8자"
              autoComplete="new-password"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password-input">비밀번호 확인</Label>
            <Input
              id="confirm-password-input"
              type="password"
              autoComplete="new-password"
              {...form.register("confirmPassword")}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite-code-input">가입코드</Label>
            <Input
              id="invite-code-input"
              placeholder="초대/가입 코드"
              {...form.register("inviteCode")}
            />
            {form.formState.errors.inviteCode && (
              <p className="text-sm text-destructive">
                {form.formState.errors.inviteCode.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            type="submit"
            variant="default"
            onClick={onSubmit}
            disabled={!form.formState.isValid}
          >
            가입하기
          </Button>
        </CardFooter>
      </Card>

      {isEmailDialogOpen && (
        <EmailCheckDialog
          open={isEmailDialogOpen}
          initialEmail={form.getValues("email")}
          onOpenChange={(o: boolean) =>
            o ? openEmailDialog() : closeEmailDialog()
          }
          onConfirm={confirmEmailFromDialog}
          onCheck={checkEmailDuplicate}
        />
      )}
    </div>
  );
}
