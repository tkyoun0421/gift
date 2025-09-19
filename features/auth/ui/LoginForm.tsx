"use client";

import * as React from "react";
import { Suspense } from "react";
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
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";
import Link from "next/link";
import { LoadingSpinner } from "@/shared/ui/loading";

function LoginFormContent() {
  const { form, onSubmit } = useLoginForm();

  return (
    <div className="mx-auto flex min-h-[80dvh] max-w-md items-center px-4">
      <Card className="w-full">
        <form onSubmit={onSubmit}>
          <CardHeader>
            <CardTitle className="text-xl">로그인</CardTitle>
            <CardDescription>관리자 로그인</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email-input">이메일</Label>
              <Input
                id="email-input"
                placeholder="admin@example.com"
                {...form.register("email")}
                className="flex-1 h-10 text-base"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password-input">비밀번호</Label>
              <Input
                id="password-input"
                type="password"
                placeholder="비밀번호"
                autoComplete="current-password"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex w-full flex-col">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              type="submit"
              variant="default"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <LoadingSpinner label="로그인 중..." />
              ) : (
                "로그인"
              )}
            </Button>
            <div className="mt-3 w-full text-center text-sm text-muted-foreground">
              아직 계정이 없다면?
              <Link
                href="/signup"
                className="ml-1 text-blue-600 hover:underline"
              >
                회원가입
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={<LoadingSpinner label="로딩 중..." />}>
      <LoginFormContent />
    </Suspense>
  );
}
