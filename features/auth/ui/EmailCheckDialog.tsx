"use client";

import * as React from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export type EmailDialogStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "error";

export default function EmailCheckDialog({
  open,
  onOpenChange,
  initialEmail,
  onConfirm,
  onCheck,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEmail?: string;
  onConfirm: (email: string) => void;
  onCheck: (email: string) => Promise<{ available: boolean; message: string }>;
}) {
  const [email, setEmail] = React.useState(initialEmail ?? "");
  const [status, setStatus] = React.useState<EmailDialogStatus>("idle");
  const [message, setMessage] = React.useState<string>("");

  const runCheck = async () => {
    setStatus("checking");
    setMessage("");
    try {
      const res = await onCheck(email);
      if (res.available) {
        setStatus("available");
      } else {
        setStatus("taken");
      }
      setMessage(res.message);
    } catch (e: any) {
      setStatus("error");
      setMessage("확인 중 오류");
    }
  };

  const close = () => onOpenChange(false);
  const confirm = () => onConfirm(email.trim());

  const confirmDisabled = status !== "available";

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
      onClick={e => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="w-full max-w-md rounded-xl bg-background shadow-xl">
        <div className="p-6">
          <h2 className="mb-1 text-lg font-semibold">이메일 중복확인</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            사용할 이메일을 입력하고 중복확인을 진행하세요.
          </p>

          <div className="space-y-2">
            <Label htmlFor="email-check-input">이메일</Label>
            <div className="flex gap-2">
              <Input
                id="email-check-input"
                autoFocus
                placeholder="example@email.com"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setStatus("idle");
                  setMessage("");
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") runCheck();
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={runCheck}
                disabled={status === "checking"}
              >
                {status === "checking" ? "확인 중..." : "중복확인"}
              </Button>
            </div>
            {message && (
              <p
                className={
                  status === "available"
                    ? "text-sm text-emerald-600"
                    : status === "taken"
                      ? "text-sm text-destructive"
                      : "text-sm text-muted-foreground"
                }
              >
                {message}
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={close}>
              취소
            </Button>
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={confirm}
              disabled={confirmDisabled}
            >
              확인
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
