import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "타이거 부동산 | 상담 및 임장 안내",
  description:
    "서울·수도권 부동산 상담, 시장 분석, 임장 안내를 제공하는 타이거 부동산 공식 사이트입니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}