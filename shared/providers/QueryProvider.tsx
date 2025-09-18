"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 5분간 데이터를 fresh로 유지
            staleTime: 5 * 60 * 1000,
            // 10분간 캐시 유지
            gcTime: 10 * 60 * 1000,
            // 네트워크 오류 시 재시도
            retry: (failureCount, error: any) => {
              // 4xx 에러는 재시도하지 않음
              if (error?.status >= 400 && error?.status < 500) {
                return false;
              }
              // 최대 3번 재시도
              return failureCount < 3;
            },
            // 윈도우 포커스 시 자동 리페치 비활성화
            refetchOnWindowFocus: false,
          },
          mutations: {
            // 뮤테이션 실패 시 재시도하지 않음
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
