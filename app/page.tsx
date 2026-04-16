import Link from "next/link";
import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const products = [
  {
    title: "대면 상담 1시간",
    description: "직접 만나 현재 상황과 방향을 깊이 있게 상담합니다.",
  },
  {
    title: "전화 상담 1시간",
    description: "거리 부담 없이 편하게 상담받을 수 있는 상품입니다.",
  },
  {
    title: "대면 상담 1시간 + After 1회",
    description: "1차 상담 후 추가 질문까지 이어서 정리할 수 있습니다.",
  },
  {
    title: "전화 상담 1시간 + After 1회",
    description: "전화 상담 후 후속 질문까지 연결되는 상품입니다.",
  },
  {
    title: "추가 상담 1시간",
    description: "기존 상담 이후 추가 점검이 필요한 분들을 위한 상품입니다.",
  },
];

const steps = [
  {
    step: "STEP 1",
    title: "상담 신청",
    description: "원하는 상담 상품을 선택하고 희망 일정 3개를 입력합니다.",
  },
  {
    step: "STEP 2",
    title: "일정 조율",
    description: "신청 내용을 확인한 뒤 가능한 일정으로 최종 조율합니다.",
  },
  {
    step: "STEP 3",
    title: "상담 진행",
    description: "확정된 일정에 맞춰 전화 또는 대면 상담을 진행합니다.",
  },
];

const recommends = [
  "실거주와 투자 방향이 헷갈리는 분",
  "매수 시점과 지역 선택이 고민되는 분",
  "현재 자산 상황에 맞는 전략이 필요한 분",
  "전화 또는 대면으로 깊이 있게 상담받고 싶은 분",
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="bg-white text-gray-900">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8f4e8_0%,#fffaf1_48%,#ffffff_100%)]">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute left-[-120px] top-[-80px] h-[280px] w-[280px] rounded-full bg-amber-200 blur-3xl" />
            <div className="absolute right-[-80px] top-[100px] h-[220px] w-[220px] rounded-full bg-orange-100 blur-3xl" />
          </div>

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
            <div className="max-w-2xl">
              <p className="mb-5 inline-flex rounded-full border border-amber-200 bg-amber-100/80 px-4 py-1.5 text-sm font-medium text-amber-900 shadow-sm">
                Tiger Rich Company 상담 서비스
              </p>

              <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                부동산 상담,
                <br />
                더 선명하게
                <br />
                더 전략적으로
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
                전화 상담과 대면 상담을 한 번에 신청하고,
                희망 날짜 3개를 제출한 뒤 운영자와 최종 일정을 조율할 수 있습니다.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/consult"
                  className="rounded-2xl bg-black px-6 py-4 text-center font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-gray-800"
                >
                  상담 신청하러 가기
                </Link>

                <a
                  href="#products"
                  className="rounded-2xl border border-gray-300 bg-white px-6 py-4 text-center font-semibold text-gray-800 transition hover:bg-gray-50"
                >
                  상담 상품 보기
                </a>
                <a
                  href="https://open.kakao.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-gray-300 px-6 py-4 font-semibold hover:bg-gray-50 transition"
                >
                  오픈채팅 바로가기
                </a>
              </div>

              <div className="mt-8 grid gap-2 text-sm text-gray-600">
                <p>✔ 희망 일정 3개 제출</p>
                <p>✔ 무통장입금 / 카드결제 확장 가능</p>
                <p>✔ 신청 즉시 텔레그램 알림 연동</p>
              </div>
            </div>

            <div className="relative flex justify-center md:justify-end">
              <div className="absolute inset-x-8 bottom-6 h-24 rounded-full bg-black/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/40 p-3 shadow-2xl shadow-black/10 backdrop-blur">
                <Image
                  src="/images/tiger.png"
                  alt="Tiger Rich Company Tiger"
                  width={520}
                  height={640}
                  className="h-auto w-full max-w-[460px] rounded-[22px] object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Recommendation */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Recommendation
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              이런 분께 추천합니다
            </h2>
            <p className="mt-4 text-gray-600 leading-7">
              혼자 판단하기 어려운 부동산 문제를 보다 명확하게 정리하고 싶은 분들을 위한 상담입니다.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {recommends.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-base font-medium text-gray-900">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Products */}
        <section
          id="products"
          className="bg-[linear-gradient(180deg,#fafafa_0%,#f5f5f5_100%)]"
        >
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                Products
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                상담 상품 안내
              </h2>
              <p className="mt-4 text-gray-600 leading-7">
                가격은 추후 운영 정책에 따라 조정될 수 있으며,
                현재는 관리자에서 쉽게 수정 가능한 구조로 설계 중입니다.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.title}
                  className="group rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                    상담 상품
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {product.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {product.description}
                  </p>
                  <div className="mt-6 border-t border-gray-100 pt-4">
                    <p className="text-sm font-medium text-amber-700">
                      가격: 추후 안내 / 관리자 수정 가능
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Process
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              진행 방식
            </h2>
            <p className="mt-4 text-gray-600 leading-7">
              복잡하지 않게 신청하고, 운영자가 직접 일정을 확정하는 방식입니다.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((item) => (
              <div
                key={item.step}
                className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition hover:shadow-md"
              >
                <p className="text-sm font-bold tracking-wide text-amber-700">
                  {item.step}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Notice */}
        <section className="bg-[linear-gradient(180deg,#f9f3df_0%,#f6ecd0_100%)]">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="rounded-[32px] border border-amber-200 bg-white/80 p-8 shadow-sm backdrop-blur md:p-10">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                신청 전 안내
              </h2>
              <div className="mt-6 space-y-3 text-gray-700 leading-7">
                <p>• 결제 완료 후에도 최종 상담 일정은 운영자 확인 후 확정됩니다.</p>
                <p>• 희망 날짜와 시간은 총 3개까지 제출해 주세요.</p>
                <p>• 신청 후 운영자가 확인한 뒤 일정 조율 안내를 드립니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="overflow-hidden rounded-[36px] bg-black px-8 py-12 text-white shadow-2xl shadow-black/20 md:px-12 md:py-14">
            <div className="grid gap-8 md:grid-cols-[1.3fr_0.7fr] md:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                  Start Now
                </p>
                <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                  지금 상담 신청하고
                  <br />
                  내 상황에 맞는 방향을
                  <br />
                  정리해보세요
                </h2>
                <p className="mt-5 max-w-2xl text-gray-300 leading-7">
                  사이트에서 상담 신청서를 작성하고, 희망 일정 3개를 제출하면
                  운영자가 확인 후 상담 일정을 조율합니다.
                </p>
              </div>

              <div className="flex md:justify-end">
                <Link
                  href="/consult"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 font-semibold text-black transition hover:bg-gray-100"
                >
                  상담 신청 바로가기
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    <Footer />
    </>
  );
}