import { supabaseAdmin } from "@/lib/supabase-admin";
import AdminLogoutButton from "./AdminLogoutButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Consultation = {
  id: number;
  name: string;
  phone: string;
  product: string;
  memo?: string | null;
  date1: string;
  time1: string;
  date2: string;
  time2: string;
  date3: string;
  time3: string;
  payment: string;
  created_at: string;
};

type SearchParams = Promise<{
  q?: string;
  product?: string;
}>;

function formatDateTime(value: string) {
  if (!value) return "-";

  try {
    return new Intl.DateTimeFormat("ko-KR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function getProductOptions(items: Consultation[]) {
  return Array.from(new Set(items.map((item) => item.product))).filter(Boolean);
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const selectedProduct = params.product?.trim() || "";

  let consultations: Consultation[] = [];
  let errorMessage = "";

  if (!supabaseAdmin) {
    errorMessage =
      "Supabase 환경변수가 설정되지 않아 상담 신청 내역을 불러올 수 없습니다.";
  } else {
    const { data, error } = await supabaseAdmin
      .from("consultations")
      .select("*")
      .order("created_at", { ascending: false });

    consultations = (data || []) as Consultation[];
    errorMessage = error?.message || "";
  }

  const filteredConsultations = consultations.filter((item) => {
    const matchesQuery =
      !query ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.phone.includes(query);

    const matchesProduct =
      !selectedProduct || item.product === selectedProduct;

    return matchesQuery && matchesProduct;
  });

  const productOptions = getProductOptions(consultations);
  const totalCount = consultations.length;
  const todayCount = consultations.filter((item) => {
    const created = new Date(item.created_at);
    const now = new Date();

    return (
      created.getFullYear() === now.getFullYear() &&
      created.getMonth() === now.getMonth() &&
      created.getDate() === now.getDate()
    );
  }).length;
  const phoneConsultCount = consultations.filter((item) =>
    item.product.includes("전화")
  ).length;
  const offlineConsultCount = consultations.filter((item) =>
    item.product.includes("대면")
  ).length;

  return (
    <main className="min-h-screen bg-[#f8f4e8] px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Admin Dashboard
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              상담 신청 관리
            </h1>
            <p className="mt-3 text-gray-600">
              접수된 상담 신청 내역을 확인하고 빠르게 찾을 수 있습니다.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/consult"
              className="rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-gray-50"
            >
              상담 페이지 보기
            </Link>
            <AdminLogoutButton />
          </div>
        </div>

        {errorMessage ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            데이터를 불러오는 중 문제가 발생했습니다.
            <div className="mt-2 text-sm">{errorMessage}</div>
          </div>
        ) : (
          <>
            <section className="mb-8 grid gap-4 md:grid-cols-4">
              <div className="rounded-[24px] bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">전체 신청</p>
                <p className="mt-3 text-3xl font-bold">{totalCount}</p>
              </div>
              <div className="rounded-[24px] bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">오늘 신청</p>
                <p className="mt-3 text-3xl font-bold">{todayCount}</p>
              </div>
              <div className="rounded-[24px] bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">전화 상담</p>
                <p className="mt-3 text-3xl font-bold">{phoneConsultCount}</p>
              </div>
              <div className="rounded-[24px] bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">대면 상담</p>
                <p className="mt-3 text-3xl font-bold">{offlineConsultCount}</p>
              </div>
            </section>

            <section className="mb-8 rounded-[24px] bg-white p-6 shadow-sm">
              <form className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_auto]">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    이름 또는 연락처 검색
                  </label>
                  <input
                    type="text"
                    name="q"
                    defaultValue={query}
                    placeholder="예: 홍길동 / 01012345678"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    상담 상품 필터
                  </label>
                  <select
                    name="product"
                    defaultValue={selectedProduct}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  >
                    <option value="">전체 상품</option>
                    {productOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end gap-3">
                  <button
                    type="submit"
                    className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    검색
                  </button>
                  <Link
                    href="/admin"
                    className="rounded-2xl border border-gray-300 px-5 py-3 text-sm font-semibold transition hover:bg-gray-50"
                  >
                    초기화
                  </Link>
                </div>
              </form>
            </section>

            {filteredConsultations.length === 0 ? (
              <div className="rounded-[24px] bg-white p-10 text-center text-gray-500 shadow-sm">
                조건에 맞는 상담 신청 내역이 없습니다.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-[24px] border border-gray-200 bg-white shadow-lg shadow-black/5">
                <table className="min-w-full text-sm">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="px-4 py-4 text-left font-semibold">번호</th>
                      <th className="px-4 py-4 text-left font-semibold">신청일시</th>
                      <th className="px-4 py-4 text-left font-semibold">이름</th>
                      <th className="px-4 py-4 text-left font-semibold">연락처</th>
                      <th className="px-4 py-4 text-left font-semibold">상품</th>
                      <th className="px-4 py-4 text-left font-semibold">1순위</th>
                      <th className="px-4 py-4 text-left font-semibold">2순위</th>
                      <th className="px-4 py-4 text-left font-semibold">3순위</th>
                      <th className="px-4 py-4 text-left font-semibold">결제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConsultations.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-t border-gray-100 align-top hover:bg-amber-50/40"
                      >
                        <td className="px-4 py-4">
                          {filteredConsultations.length - index}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          {formatDateTime(item.created_at)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 font-medium">
                          {item.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">{item.phone}</td>
                        <td className="whitespace-nowrap px-4 py-4">
                          {item.product}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          {item.date1} {item.time1}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          {item.date2} {item.time2}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          {item.date3} {item.time3}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          {item.payment}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
