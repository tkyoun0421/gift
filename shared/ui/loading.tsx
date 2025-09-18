import { cn } from "@/shared/lib/utils";
import { Loader2 } from "lucide-react";
import * as React from "react";

export function LoadingSpinner({
  className,
  label,
  size = 16,
}: {
  className?: string;
  label?: string;
  size?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Loader2 className="animate-spin" style={{ width: size, height: size }} />
      {label ? <span className="text-sm">{label}</span> : null}
    </span>
  );
}

export function LoadingOverlay({ text = "로딩 중..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30">
      <div className="rounded-md bg-white px-4 py-3 shadow">
        <LoadingSpinner label={text} />
      </div>
    </div>
  );
}
