import "./globals.css";
import type { Metadata } from "next";
import FloatingDepositBanner from "./components/FloatingDepositBanner";

export const metadata: Metadata = {
  title: "Tiger Rich Company | 부동산 상담 신청",
  description:
    "부동산 상담 상품을 확인하고 원하는 일정으로 상담을 신청할 수 있는 Tiger Rich Company 공식 사이트입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
        <FloatingDepositBanner />
      </body>
    </html>
  );
}
