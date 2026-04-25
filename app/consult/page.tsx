"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type FormData = {
  name: string;
  phone: string;
  product: string;
  memo: string;
  date1: string;
  time1: string;
  date2: string;
  time2: string;
  date3: string;
  time3: string;
  payment: string;
};

const productOptions = [
  "전화 상담 1시간",
  "대면 상담 1시간",
  "전화 상담 1시간 + After 1회",
  "대면 상담 1시간 + After 1회",
  "추가 상담 1시간",
];

const timeOptions = Array.from({ length: 15 }, (_, index) => {
  const hour = index + 9;
  return `${String(hour).padStart(2, "0")}:00`;
});

const initialFormData: FormData = {
  name: "",
  phone: "",
  product: "전화 상담 1시간",
  memo: "",
  date1: "",
  time1: "",
  date2: "",
  time2: "",
  date3: "",
  time3: "",
  payment: "무통장입금",
};

export default function ConsultPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const today = useMemo(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().split("T")[0];
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setMessage(data?.message || "상담 신청 중 오류가 발생했습니다.");
        return;
      }

      setFormData(initialFormData);
      router.push("/consult/complete");
      router.refresh();
    } catch (error) {
      console.error("Consult submit error:", error);
      setMessage("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[linear-gradient(180deg,#f8f4e8_0%,#fffaf1_35%,#ffffff_100%)] text-gray-900">
        <section className="border-b border-black/5">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full border border-amber-200 bg-amber-100/80 px-4 py-1.5 text-sm font-medium text-amber-900 shadow-sm">
                Consult Application
              </p>
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
                상담 신청
              </h1>
              <p className="mt-5 text-lg leading-8 text-gray-600">
                원하는 상담 상품을 선택하고 가능한 날짜와 시간을 남겨주세요.
                접수 후 운영자가 확인해 상담 일정을 조율합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[28px] border border-white/60 bg-white/85 p-6 shadow-xl shadow-black/5 backdrop-blur md:p-8">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                  Application Form
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                  상담 정보를 입력해주세요
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold">기본 정보</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        이름
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="이름을 입력하세요"
                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        연락처
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="예: 010-1234-5678"
                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">상담 상품</h3>
                  <select
                    name="product"
                    className="mt-4 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    value={formData.product}
                    onChange={handleChange}
                  >
                    {productOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">희망 일정</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    과거 날짜는 선택할 수 없습니다. 시간은 1시간 단위로 선택해주세요.
                  </p>

                  <div className="mt-5 space-y-4">
                    {[1, 2, 3].map((num) => (
                      <div
                        key={num}
                        className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4"
                      >
                        <p className="mb-3 text-sm font-semibold text-amber-700">
                          {num}순위 일정
                        </p>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                              날짜
                            </label>
                            <input
                              type="date"
                              name={`date${num}`}
                              min={today}
                              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                              value={formData[`date${num}` as keyof FormData] as string}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                              시간
                            </label>
                            <select
                              name={`time${num}`}
                              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                              value={formData[`time${num}` as keyof FormData] as string}
                              onChange={handleChange}
                              required
                            >
                              <option value="">시간 선택</option>
                              {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">상담 내용</h3>
                  <textarea
                    name="memo"
                    rows={5}
                    placeholder="상담받고 싶은 내용을 적어주세요"
                    className="mt-4 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    value={formData.memo}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold">결제 방식</h3>
                  <select
                    name="payment"
                    className="mt-4 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    value={formData.payment}
                    onChange={handleChange}
                  >
                    <option value="무통장입금">무통장입금</option>
                    <option value="카드결제">카드결제</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-black px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "접수 중..." : "상담 신청하기"}
                  </button>

                  {message ? (
                    <p className="mt-4 text-center text-sm font-medium text-red-600">
                      {message}
                    </p>
                  ) : null}
                </div>
              </form>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[28px] border border-amber-200 bg-white/85 p-7 shadow-xl shadow-black/5 backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                  Guide
                </p>
                <h3 className="mt-3 text-2xl font-bold tracking-tight">
                  신청 전 안내
                </h3>

                <div className="mt-5 space-y-3 text-sm leading-7 text-gray-700">
                  <p>희망 일정은 최대 3개까지 입력할 수 있습니다.</p>
                  <p>신청 즉시 관리자에게 텔레그램 알림이 전송됩니다.</p>
                  <p>운영자가 확인 후 최종 상담 일정을 안내합니다.</p>
                  <p>카드 결제는 테스트 중이며 필요 시 무통장입금으로 진행됩니다.</p>
                </div>
              </div>

              <div className="rounded-[28px] bg-black p-7 text-white shadow-2xl shadow-black/15">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                  Kakao Talk
                </p>
                <h3 className="mt-3 text-2xl font-bold tracking-tight">
                  빠른 문의가 필요하신가요?
                </h3>
                <a
                  href="https://open.kakao.com/o/gbBMu9Lh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex rounded-2xl bg-yellow-300 px-5 py-3 font-semibold text-gray-950 transition hover:bg-yellow-400"
                >
                  카카오톡 상담 바로가기
                </a>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
