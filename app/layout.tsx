import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import "./globals.css";
// removed custom ToastProvider
import { Toaster } from "sonner";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "컬쳐캐피탈",
  description: "컬쳐캐피탈 이벤트 신청 및 가입상담문의",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_two@1.0/NanumSquareRound.woff"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_two@1.0/NanumSquare.woff"
          rel="stylesheet"
        />
      </head>
      <body className="font-nanum antialiased">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors position="bottom-center" />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
