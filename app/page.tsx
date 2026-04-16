import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const services = [
  {
    title: "부동산 상담",
    description:
      "서울·수도권 부동산 흐름을 바탕으로 현재 상황에 맞는 방향을 함께 정리해드립니다.",
  },
  {
    title: "임장 방향 안내",
    description:
      "어디를 봐야 하는지 막막할 때, 현실적으로 볼 수 있는 지역과 동선을 함께 정리합니다.",
  },
  {
    title: "시장 흐름 정리",
    description:
      "복잡한 뉴스와 시장 분위기를 실수요자 관점에서 이해하기 쉽게 정리해드립니다.",
  },
];

const steps = [
  {
    step: "01",
    title: "상담 신청",
    description: "상담 페이지에서 기본 정보와 희망 일정을 입력합니다.",
  },
  {
    step: "02",
    title: "일정 조율",
    description: "운영자가 신청 내용을 확인한 뒤 가능한 일정으로 안내드립니다.",
  },
  {
    step: "03",
    title: "상담 진행",
    description: "전화 또는 대면으로 상담을 진행하며 방향을 함께 정리합니다.",
  },
];

const strengths = [
  "서울·수도권 중심 시장 흐름 정리",
  "실수요자 관점의 현실적인 상담",
  "상담 신청부터 일정 조율까지 간단한 프로세스",
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[linear-gradient(180deg,#f8f4e8_0%,#fffaf1_38%,#ffffff_100%)] text-gray-900">
        {/* Hero */}
        <section className="border-b border-black/5">
          <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
            <div className="overflow-hidden rounded-[36px] border border-amber-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              <div className="grid gap-8 px-8 py-10 md:grid-cols-[1.15fr_0.85fr] md:px-12 md:py-14">
                <div className="flex flex-col justify-center">
                  <p className="inline-flex w-fit rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-800 shadow-sm">
                    서울·수도권 부동산 상담 및 임장 안내
                  </p>

                  <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
                    복잡한 부동산 시장,
                    <br />
                    길잡이가 되겠습니다
                  </h1>

                  <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                    서울·수도권 부동산 상담, 시장 흐름 정리, 임장 방향 안내까지
                    현재 상황에 맞는 현실적인 방향을 함께 정리해드립니다.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                      href="/consult"
                      className="rounded-2xl bg-gray-950 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-gray-800"
                    >
                      상담 신청하기
                    </Link>

                    <a
                      href="https://open.kakao.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-2xl border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-800 transition hover:bg-gray-50"
                    >
                      오픈채팅 바로가기
                    </a>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3 text-sm">
                    <span className="rounded-full border border-amber-100 bg-amber-50 px-4 py-2 text-amber-800 shadow-sm">
                      시장 흐름 정리
                    </span>
                    <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-gray-700 shadow-sm">
                      상담 신청 가능
                    </span>
                    <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-gray-700 shadow-sm">
                      임장 방향 안내
                    </span>
                  </div>
                </div>

                <div className="rounded-[30px] border border-amber-100 bg-[linear-gradient(180deg,#fffaf1_0%,#fff7e8_100%)] p-8 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                    Why Tiger
                  </p>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-950">
                    이런 분들께 추천합니다
                  </h2>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-amber-100 bg-white px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        어디를 봐야 할지 막막한 분
                      </p>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        서울과 수도권 중 어떤 지역을 먼저 봐야 하는지 방향을
                        정리해드립니다.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        뉴스는 많은데 판단이 어려운 분
                      </p>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        복잡한 시장 이야기를 실수요자 기준으로 쉽게 풀어드립니다.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        임장 전에 동선을 잡고 싶은 분
                      </p>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        시간 낭비 없이 현실적으로 볼 수 있는 지역부터 정리합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service */}
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Service
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              제공하는 서비스
            </h2>
            <p className="mt-4 text-gray-600">
              단순한 정보 전달이 아니라, 실제 판단에 도움이 되는 방향을 함께
              정리합니다.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-[28px] border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
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

        {/* Process */}
        <section className="bg-[#1f1a17] text-white">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                Process
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                상담 진행 방식
              </h2>
              <p className="mt-4 text-gray-300">
                신청부터 상담 진행까지 간단하고 명확하게 진행됩니다.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-[28px] border border-white/10 bg-white/5 p-7"
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

        {/* Strength */}
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                Strength
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                왜 이 사이트를 써야 할까요?
              </h2>
              <p className="mt-4 leading-8 text-gray-600">
                부동산은 단순히 정보가 많은 것보다, 지금 내 상황에 맞는 판단이
                더 중요합니다. 복잡한 흐름을 현실적으로 정리하는 데 집중합니다.
              </p>
            </div>

            <div className="space-y-4">
              {strengths.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-gray-200 bg-white px-5 py-4 pl-6 shadow-sm"
                >
                  <p className="flex items-center font-semibold text-gray-900">
                    <span className="mr-2 text-amber-500">•</span>
                    {item.trim()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-20 md:pb-24">
          <div className="mx-auto max-w-6xl rounded-[36px] bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 px-8 py-12 text-gray-900 shadow-2xl md:px-12 md:py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-800">
              Call To Action
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              이제 혼자 고민하지 말고,
              <br />
              상담으로 먼저 방향을 잡아보세요
            </h2>

            <p className="mt-4 max-w-2xl leading-8 text-gray-800">
              어디를 봐야 할지, 지금 움직여도 되는지, 어떤 흐름을 먼저
              이해해야 하는지 상담을 통해 차근차근 정리해드립니다.
            </p>

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
                오픈채팅 바로가기(비번:0906)
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}