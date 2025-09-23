import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import "./globals.css";
// removed custom ToastProvider
import { Toaster } from "sonner";

// SEO constants
const SITE_URL = "https://www.culturecapitalllc1.com";
const LOGO_URL =
  "https://gjgciairviherlylizsx.supabase.co/storage/v1/object/public/images/logo.webp";
const OG_IMAGE_URL =
  "https://gjgciairviherlylizsx.supabase.co/storage/v1/object/public/images/service.webp";
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "컬쳐캐피탈",
  description: "컬쳐캐피탈 이벤트 신청 및 가입상담문의",
  keywords: [
    "컬쳐캐피탈",
    "이벤트 신청",
    "가입 상담",
    "해외 선물",
    "메타트레이더",
    "KBS N",
    "두바이 엑스포",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "컬쳐캐피탈",
    title: "컬쳐캐피탈",
    description: "컬쳐캐피탈 이벤트 신청 및 가입상담문의",
    locale: "ko_KR",
    images: [
      {
        url: OG_IMAGE_URL,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: "컬쳐캐피탈 서비스 이미지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "컬쳐캐피탈",
    description: "컬쳐캐피탈 이벤트 신청 및 가입상담문의",
    images: [OG_IMAGE_URL],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      "/favicon.ico",
      {
        url: LOGO_URL,
        type: "image/webp",
      },
    ],
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "컬쳐캐피탈",
              url: SITE_URL,
              logo: LOGO_URL,
            }),
          }}
        />
      </head>
      <body className="font-nanum antialiased">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
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
