import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const services = [
  {
    title: "전화 상담",
    description:
      "현재 상황과 예산, 관심 지역을 기준으로 부동산 시장 흐름과 다음 행동을 정리합니다.",
  },
  {
    title: "대면 상담",
    description:
      "조금 더 깊이 있는 방향 설정이 필요할 때 현장감 있는 상담으로 판단 기준을 잡아드립니다.",
  },
  {
    title: "현장 방향 안내",
    description:
      "어디를 먼저 봐야 하는지, 어떤 포인트를 확인해야 하는지 실전 중심으로 안내합니다.",
  },
];

const steps = [
  {
    step: "01",
    title: "상담 신청",
    description: "상담 상품과 기본 정보, 희망 일정을 입력합니다.",
  },
  {
    step: "02",
    title: "일정 조율",
    description: "운영자가 신청 내용을 확인하고 가능한 일정으로 조율합니다.",
  },
  {
    step: "03",
    title: "상담 진행",
    description: "확정된 시간에 전화 또는 대면 상담을 진행합니다.",
  },
];

const strengths = [
  "서울 및 수도권 중심 시장 흐름 정리",
  "실수요자 관점의 현실적인 상담",
  "신청부터 일정 조율까지 간단한 프로세스",
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[linear-gradient(180deg,#f8f4e8_0%,#fffaf1_38%,#ffffff_100%)] text-gray-900">
        <section className="border-b border-black/5">
          <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
            <div className="overflow-hidden rounded-[32px] border border-amber-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              <div className="grid gap-8 px-8 py-10 md:grid-cols-[1.15fr_0.85fr] md:px-12 md:py-14">
                <div className="flex flex-col justify-center">
                  <p className="inline-flex w-fit rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-800 shadow-sm">
                    부동산 상담 및 현장 안내
                  </p>

                  <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
                    복잡한 부동산 판단,
                    <br />
                    상담으로 먼저 정리하세요.
                  </h1>

                  <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                    관심 지역, 자금 계획, 현장 방문 방향까지 지금 상황에 맞는
                    현실적인 상담을 제공합니다.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                      href="/consult"
                      className="rounded-2xl bg-gray-950 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-gray-800"
                    >
                      상담 신청하기
                    </Link>

                    <a
                      href="https://open.kakao.com/o/gbBMu9Lh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-2xl border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-800 transition hover:bg-gray-50"
                    >
                      오픈채팅 바로가기
                    </a>
                  </div>
                </div>

                <div className="rounded-[28px] border border-amber-100 bg-[linear-gradient(180deg,#fffaf1_0%,#fff7e8_100%)] p-8 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                    Why Tiger
                  </p>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-950">
                    이런 분께 추천합니다
                  </h2>

                  <div className="mt-6 space-y-4">
                    {[
                      "어디를 봐야 할지 막막한 분",
                      "뉴스보다 내 상황 기준의 판단이 필요한 분",
                      "현장 방문 전 동선을 줄이고 싶은 분",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-amber-100 bg-white px-5 py-4"
                      >
                        <p className="font-semibold text-gray-900">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Service
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              제공하는 상담
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-[24px] border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-xl font-bold tracking-tight">
                  {service.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#1f1a17] text-white">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                Process
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                상담 진행 방식
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-7"
                >
                  <p className="text-sm font-semibold tracking-[0.2em] text-amber-300">
                    {item.step}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-gray-300">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                Strength
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                신뢰감 있는 상담 흐름
              </h2>
              <p className="mt-4 leading-8 text-gray-600">
                단순 정보 전달보다 지금 상황에 맞는 판단 기준과 다음 행동을
                정리하는 데 집중합니다.
              </p>
            </div>

            <div className="space-y-4">
              {strengths.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-gray-200 bg-white px-5 py-4 pl-6 shadow-sm"
                >
                  <p className="font-semibold text-gray-900">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-20 md:pb-24">
          <div className="mx-auto max-w-6xl rounded-[32px] bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 px-8 py-12 text-gray-900 shadow-2xl md:px-12 md:py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-800">
              Call To Action
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              고민만 오래 하기보다
              <br />
              먼저 상담으로 방향을 잡아보세요.
            </h2>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/consult"
                className="rounded-2xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
              >
                상담 신청하러 가기
              </Link>

              <a
                href="https://open.kakao.com/o/gbBMu9Lh"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-black px-6 py-3 font-semibold text-black transition hover:bg-black hover:text-white"
              >
                오픈채팅 바로가기
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
