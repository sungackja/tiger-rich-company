"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data.message || "로그인에 실패했습니다.");
        return;
      }

      router.push(next);
      router.refresh();
    } catch (error) {
      console.error("관리자 로그인 오류:", error);
      setMessage("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f4e8_0%,#fffaf1_35%,#ffffff_100%)] px-6 py-16 text-gray-900">
      <div className="mx-auto max-w-md rounded-[32px] border border-white/60 bg-white/90 p-8 shadow-xl shadow-black/5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Admin Access
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          관리자 로그인
        </h1>
        <p className="mt-3 text-sm leading-7 text-gray-600">
          관리자 페이지 접근을 위해 비밀번호를 입력하세요.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="관리자 비밀번호"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "확인 중..." : "로그인"}
          </button>

          {message ? (
            <p className="text-center text-sm font-medium text-red-600">
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </main>
  );
}