"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type FormData = {
  name: string;
  age: string;
  gender: string;
  phone: string;
  family: string;
  homeAddress: string;
  investmentAddress: string;
  income: string;
  assets: string;
  debts: string;
  loanIntent: string;
  purpose: string[];
  consultType: string;
  preferredSchedule: string;
  message: string;
  receiptType: string;
  receiptNumber: string;
  privacyConsent: string;
};

type FieldName = keyof FormData;

type Question = {
  number: number;
  field: FieldName;
  title: string;
  description?: string;
  type: "text" | "textarea" | "radio" | "checkbox" | "consent";
  options?: string[];
  placeholder?: string;
};

const initialFormData: FormData = {
  name: "",
  age: "",
  gender: "",
  phone: "",
  family: "",
  homeAddress: "",
  investmentAddress: "",
  income: "",
  assets: "",
  debts: "",
  loanIntent: "",
  purpose: [],
  consultType: "",
  preferredSchedule: "",
  message: "",
  receiptType: "",
  receiptNumber: "",
  privacyConsent: "",
};

const questions: Question[] = [
  {
    number: 1,
    field: "name",
    title: "성함",
    description:
      "부부가 함께 참여하실 경우 두 분 성함 모두 작성 부탁드립니다. (혹은 +'배우자' 로만 쓰셔도 됩니다.)",
    type: "text",
  },
  {
    number: 2,
    field: "age",
    title: "연령대",
    description:
      "구체적으로 적어주시면 상담에 더 도움이 됩니다. (ex. 40대 or 40대 초반 or 43세 등)",
    type: "text",
  },
  {
    number: 3,
    field: "gender",
    title: "성별",
    description: "최대 1개 선택 가능",
    type: "radio",
    options: ["남", "여"],
  },
  {
    number: 4,
    field: "phone",
    title: "연락처",
    description: "000-0000-0000 의 형태로 적어주세요.",
    type: "text",
  },
  {
    number: 5,
    field: "family",
    title: "가족구성원",
    description:
      "자녀가 있을 시엔 자녀 나이 또는 학년 / 결혼 예정 등 구체적으로 적어주세요.",
    type: "textarea",
  },
  {
    number: 6,
    field: "homeAddress",
    title: "현재 거주하시는 자택 주소",
    description:
      "지역, 아파트명 / 다세대 및 다가구는 도로명(번지)까지만 적어주세요.",
    type: "textarea",
  },
  {
    number: 7,
    field: "investmentAddress",
    title: "투자하신 다른 부동산 주소 (없으면 '없음'이라고 적어주세요.)",
    description:
      "지역, 아파트명 / 다세대 및 다가구는 도로명(번지)까지만 적어주세요.",
    type: "textarea",
  },
  {
    number: 8,
    field: "income",
    title: "연봉 (단위: 만원) - 숫자만 적어주세요! (ex. 6000)",
    description: "만약 고정적이지 않은 경우엔 평균값을 적어주세요.",
    type: "text",
  },
  {
    number: 9,
    field: "assets",
    title: "자산 현황",
    description:
      "가용할 수 있는 모든 비용을 적어주세요. 종류별로 나누어 적어주시면 더 좋습니다.",
    type: "textarea",
  },
  {
    number: 10,
    field: "debts",
    title: "부채 현황 (상환 기간, 월 이자액 등 구체적으로 적어주세요.)",
    type: "textarea",
  },
  {
    number: 11,
    field: "loanIntent",
    title: "대출 가능 범위에서 가용금액을 더 늘려 투자할 의향이 있으신지요.",
    description: "최대 1개 선택 가능",
    type: "radio",
    options: ["예", "아니오"],
  },
  {
    number: 12,
    field: "purpose",
    title: "부동산 매수 목적(복수선택)",
    type: "checkbox",
    options: ["실거주", "투자", "증여 및 상속"],
  },
  {
    number: 13,
    field: "consultType",
    title: "상담 방식",
    description:
      "신청서 제출과 입금이 이루어진 후에 상담 예약이 가능합니다. After : 기존 상담 내용과 관련 내용 (after는 전화로 진행) / 추가 상담 : 새로운 상담 내용",
    type: "radio",
    options: [
      "대면 상담 (1시간 55만원)",
      "전화 상담 (1시간 33만원)",
      "대면 상담 1회 + After 1회 (60만원) // 유료방(어흥스쿨) 회원은 55만원",
      "전화 상담 1회 + After 1회 (40만원) // 유료방(어흥스쿨) 회원은 33만원",
      "추가 상담 (1시간 22만원)",
    ],
  },
  {
    number: 14,
    field: "preferredSchedule",
    title: "원하시는 날짜 및 시간 / 지역 (서울 or 부산 : 서울은 주로 휴일에 가능합니다!)",
    description:
      "서로 가능한 시간을 조율해야하니 가능하신 날짜 및 시간대를 3개 정도 적어주세요.",
    type: "textarea",
  },
  {
    number: 15,
    field: "message",
    title: "이 외 하고싶으신 말씀",
    description: "구체적으로 적어주시면 더 적합한 답을 드릴 수 있습니다.",
    type: "textarea",
  },
  {
    number: 16,
    field: "receiptType",
    title: "상담 비용 이체 계좌 : 하나은행 130-910417-11207 (김선영)",
    description: "이체까지 완료가 되어야 신청이 접수 됩니다. 최대 1개 선택 가능",
    type: "radio",
    options: ["현금영수증 (개인) : 소득공제용", "현금영수증 (사업자) : 지출증빙용"],
  },
  {
    number: 17,
    field: "receiptNumber",
    title: "현금영수증 발급해드릴 번호 적어주세요.",
    description:
      "개인) 000-0000-0000 / 사업자) 000-00-00000 의 형태로 적어주세요.",
    type: "text",
  },
  {
    number: 18,
    field: "privacyConsent",
    title: "개인정보 수집 및 이용 동의",
    description:
      "수집하는 개인정보 항목: 상기 내용 / 수집 및 이용 목적: 답변 준비, 추후 연계 상담 및 프로그램 안내 등을 위한 자료로 활용 (외부 유출은 절대 되지 않습니다.) / 보유 및 이용기간: 상담 후 1년",
    type: "consent",
    options: ["개인정보 수집 및 이용에 동의합니다."],
  },
];

function getMissingQuestionNumber(data: FormData) {
  for (const question of questions) {
    const value = data[question.field];

    if (Array.isArray(value)) {
      if (value.length === 0) return question.number;
      continue;
    }

    if (!value.trim()) return question.number;
  }

  return null;
}

export default function ConsultPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (field: FieldName, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: FieldName, value: string) => {
    setFormData((prev) => {
      const current = prev[field];
      const selected = Array.isArray(current) ? current : [];

      return {
        ...prev,
        [field]: selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    const missingQuestionNumber = getMissingQuestionNumber(formData);

    if (missingQuestionNumber) {
      setMessage(`${missingQuestionNumber}번 질문에 답변이 없습니다.`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/consultations", {
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

  const renderQuestionInput = (question: Question) => {
    const value = formData[question.field];

    if (question.type === "textarea") {
      return (
        <textarea
          name={question.field}
          rows={4}
          placeholder={question.placeholder || "답변을 입력해주세요."}
          className="mt-4 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
          value={typeof value === "string" ? value : ""}
          onChange={handleTextChange}
        />
      );
    }

    if (question.type === "radio" || question.type === "consent") {
      return (
        <div className="mt-4 space-y-3">
          {question.options?.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 transition hover:border-amber-300"
            >
              <input
                type="radio"
                name={question.field}
                value={option}
                checked={value === option}
                onChange={() => handleOptionChange(question.field, option)}
                className="mt-1 h-4 w-4 accent-black"
              />
              <span className="text-sm leading-6 text-gray-800">{option}</span>
            </label>
          ))}
        </div>
      );
    }

    if (question.type === "checkbox") {
      const selected = Array.isArray(value) ? value : [];

      return (
        <div className="mt-4 space-y-3">
          {question.options?.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 transition hover:border-amber-300"
            >
              <input
                type="checkbox"
                name={question.field}
                value={option}
                checked={selected.includes(option)}
                onChange={() => handleCheckboxChange(question.field, option)}
                className="mt-1 h-4 w-4 accent-black"
              />
              <span className="text-sm leading-6 text-gray-800">{option}</span>
            </label>
          ))}
        </div>
      );
    }

    return (
      <input
        type="text"
        name={question.field}
        placeholder={question.placeholder || "답변을 입력해주세요."}
        className="mt-4 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
        value={typeof value === "string" ? value : ""}
        onChange={handleTextChange}
      />
    );
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
                신청서를 작성하고 상담 비용을 이체해주시면 확인 후 상담 일정을
                조율해드립니다.
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
                  상담 설문을 입력해주세요
                </h2>
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  모든 문항은 필수입니다. 비어 있는 문항이 있으면 신청이 접수되지
                  않습니다.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {questions.map((question) => (
                  <section
                    key={question.number}
                    className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                        {question.number}
                      </span>
                      <div>
                        <h3 className="text-base font-semibold leading-7 text-gray-950">
                          {question.title}
                        </h3>
                        {question.description ? (
                          <p className="mt-1 text-sm leading-6 text-gray-500">
                            {question.description}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {renderQuestionInput(question)}
                  </section>
                ))}

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-black px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span
                          aria-hidden="true"
                          className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                        />
                        <span>접수 중...</span>
                      </>
                    ) : (
                      "상담 신청하기"
                    )}
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
                  <p>이체까지 완료되어야 상담 신청이 접수됩니다.</p>
                  <p className="rounded-2xl border border-amber-300 bg-amber-100 px-4 py-3 text-base font-extrabold text-amber-950 shadow-sm">
                    계좌: 하나은행 130-910417-11207 김선영
                  </p>
                  <p>입금 확인 후 가능한 상담 일정을 조율해드립니다.</p>
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
