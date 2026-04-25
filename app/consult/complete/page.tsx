"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConsultCompletePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8f4e8_0%,#fffaf1_35%,#ffffff_100%)] px-6 py-16 text-gray-900">
      <div className="w-full max-w-lg rounded-[28px] border border-white/60 bg-white/90 p-8 text-center shadow-xl shadow-black/5 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Consultation Complete
        </p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          상담 신청이 완료되었습니다
        </h1>

        <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base">
          신청해 주셔서 감사합니다.
          <br />
          확인 후 입력하신 연락처로 안내드리겠습니다.
        </p>

        <p className="mt-4 text-sm font-medium text-gray-500">
          5초 후 홈으로 자동 이동합니다.
        </p>

        <div className="mt-8 space-y-3">
          <Link
            href="/"
            className="block w-full rounded-2xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            지금 홈으로 이동
          </Link>

          <a
            href="https://open.kakao.com/o/gbBMu9Lh"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-2xl border border-yellow-300 bg-yellow-300 px-6 py-3 font-semibold text-gray-900 transition hover:bg-yellow-400"
          >
            카카오톡 상담 바로가기
          </a>

          <Link
            href="/consult"
            className="block w-full rounded-2xl border border-gray-300 px-6 py-3 font-semibold text-gray-800 transition hover:bg-gray-50"
          >
            다시 상담 신청하기
          </Link>
        </div>
      </div>
    </main>
  );
}
