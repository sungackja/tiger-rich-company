import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tiger-rich-company.vercel.app"),
  title: "타이거 부동산 | 상담 및 임장 안내",
  description:
    "서울·수도권 부동산 상담, 시장 분석, 임장 안내를 제공하는 타이거 부동산 공식 사이트입니다.",
  keywords: [
    "부동산 상담",
    "부동산 임장",
    "서울 부동산",
    "수도권 아파트",
    "타이거 부동산",
  ],
  openGraph: {
    title: "타이거 부동산 | 상담 및 임장 안내",
    description:
      "서울·수도권 부동산 상담과 시장 분석을 제공합니다.",
    url: "https://tiger-rich-company.vercel.app",
    siteName: "타이거 부동산",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "타이거 부동산",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "타이거 부동산",
    description: "서울·수도권 부동산 상담 및 임장 안내",
    images: ["/og-image.png"],
  },
};