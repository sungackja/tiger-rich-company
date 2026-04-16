"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type FormData = {
  name: string;
  phone: string;
  product: string;
  date1: string;
  time1: string;
  date2: string;
  time2: string;
  date3: string;
  time3: string;
  payment: string;
};

const productOptions = [
  "대면 상담 1시간",
  "전화 상담 1시간",
  "대면 상담 1시간 + After 1회",
  "전화 상담 1시간 + After 1회",
  "추가 상담 1시간",
];

export default function ConsultPage() {
  const router = useRouter();

  const today = useMemo(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().split("T")[0];
  }, []);

  const initialFormData: FormData = {
    name: "",
    phone: "",
    product: "전화 상담 1시간",
    date1: "",
    time1: "",
    date2: "",
    time2: "",
    date3: "",
    time3: "",
    payment: "무통장입금",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      console.error("상담 신청 오류:", error);
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
                원하는 상담 상품을 선택하고, 희망 일정 3개를 남겨주세요.
                신청이 접수되면 운영자가 확인 후 상담 일정을 조율합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[32px] border border-white/60 bg-white/85 p-6 shadow-xl shadow-black/5 backdrop-blur md:p-8">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                  Application Form
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                  상담 정보를 입력해주세요
                </h2>
                <p className="mt-3 leading-7 text-gray-600">
                  기본 정보와 희망 일정을 입력하면 상담 신청이 접수됩니다.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold">기본 정보</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        성함
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="성함을 입력하세요"
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
                        type="text"
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
                  <h3 className="text-lg font-semibold">상담 상품 선택</h3>
                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      상담 상품
                    </label>
                    <select
                      name="product"
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
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
                </div>

                <div>
                  <h3 className="text-lg font-semibold">희망 일정</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    가능하신 날짜와 시간을 총 3개 남겨주세요. 날짜는 오늘 이후만
                    선택 가능하며, 시간은 1시간 단위로 선택해 주세요.
                  </p>

                  <div className="mt-5 space-y-4">
                    {[1, 2, 3].map((num) => (
                      <div
                        key={num}
                        className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4"
                      >
                        <p className="mb-3 text-sm font-semibold text-amber-700">
                          {num}지망 일정
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
                              value={
                                formData[`date${num}` as keyof FormData] as string
                              }
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                              시간
                            </label>
                            <input
                              type="time"
                              name={`time${num}`}
                              step={3600}
                              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                              value={
                                formData[`time${num}` as keyof FormData] as string
                              }
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">결제 방식</h3>
                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      결제 방식
                    </label>
                    <select
                      name="payment"
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                      value={formData.payment}
                      onChange={handleChange}
                    >
                      <option value="무통장입금">무통장입금</option>
                      <option value="카드결제">카드결제</option>
                    </select>
                  </div>
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
                    <p className="mt-4 text-center text-sm font-medium text-gray-700">
                      {message}
                    </p>
                  ) : null}
                </div>
              </form>
            </div>

            <div className="space-y-6">
              <div className="rounded-[32px] border border-amber-200 bg-white/85 p-7 shadow-xl shadow-black/5 backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                  Guide
                </p>
                <h3 className="mt-3 text-2xl font-bold tracking-tight">
                  신청 전 안내
                </h3>

                <div className="mt-5 space-y-3 text-sm leading-7 text-gray-700">
                  <p>• 결제 완료 후에도 최종 상담 일정은 운영자 확인 후 확정됩니다.</p>
                  <p>• 희망 날짜와 시간은 총 3개까지 입력해 주세요.</p>
                  <p>• 지난 날짜는 선택할 수 없습니다.</p>
                  <p>• 시간은 1시간 단위로 입력해 주세요.</p>
                  <p>• 신청 접수 후 운영자가 확인한 뒤 일정 조율 안내를 드립니다.</p>
                  <p>• 신청 즉시 텔레그램 알림으로 운영자에게 전달됩니다.</p>
                </div>
              </div>

              <div className="rounded-[32px] bg-black p-7 text-white shadow-2xl shadow-black/15">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                  Process
                </p>
                <h3 className="mt-3 text-2xl font-bold tracking-tight">
                  진행 방식
                </h3>

                <div className="mt-6 space-y-5 text-sm leading-7 text-gray-300">
                  <div>
                    <p className="font-semibold text-white">1. 상담 신청</p>
                    <p>상품을 선택하고 기본 정보 및 희망 일정을 입력합니다.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">2. 일정 확인</p>
                    <p>운영자가 신청 내용을 확인하고 가능한 일정으로 조율합니다.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">3. 상담 진행</p>
                    <p>확정된 일정에 맞춰 전화 또는 대면 상담을 진행합니다.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}