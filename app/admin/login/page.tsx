import { Suspense } from "react";
import AdminLoginClient from "./AdminLoginClient";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[linear-gradient(180deg,#f8f4e8_0%,#fffaf1_35%,#ffffff_100%)] px-6 py-16 text-gray-900">
          <div className="mx-auto max-w-md rounded-[32px] border border-white/60 bg-white/90 p-8 shadow-xl shadow-black/5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Admin Access
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              관리자 로그인
            </h1>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              페이지를 불러오는 중입니다.
            </p>
          </div>
        </main>
      }
    >
      <AdminLoginClient />
    </Suspense>
  );
}