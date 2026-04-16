import StatusSelect from "./StatusSelect";
import AdminLogoutButton from "./AdminLogoutButton";
import { supabaseAdmin } from "@/lib/supabase-admin";

type Consultation = {
  id: number;
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
  status: string;
  created_at: string;
};

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

function getStatusLabel(status: string) {
  switch (status) {
    case "pending":
      return "접수 완료";
    case "confirmed":
      return "일정 확정";
    case "completed":
      return "상담 완료";
    case "cancelled":
      return "취소";
    default:
      return status;
  }
}

export default async function AdminPage() {
  const { data, error } = await supabaseAdmin
    .from("consultations")
    .select("*")
    .order("created_at", { ascending: false });

  const consultations = (data || []) as Consultation[];

  return (
    <main className="min-h-screen bg-[#f8f4e8] px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Admin
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              상담 신청 조회
            </h1>
            <p className="mt-3 text-gray-600">
              상담 신청 내역을 확인하고 상태를 변경할 수 있습니다.
            </p>
          </div>

          <AdminLogoutButton />
        </div>

        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            데이터를 불러오는 중 오류가 발생했습니다.
            <div className="mt-2 text-sm">{error.message}</div>
          </div>
        ) : consultations.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center text-gray-500 shadow-sm">
            아직 접수된 상담 신청이 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-lg shadow-black/5">
            <table className="min-w-full text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold">번호</th>
                  <th className="px-4 py-4 text-left font-semibold">신청일시</th>
                  <th className="px-4 py-4 text-left font-semibold">성함</th>
                  <th className="px-4 py-4 text-left font-semibold">연락처</th>
                  <th className="px-4 py-4 text-left font-semibold">상담 상품</th>
                  <th className="px-4 py-4 text-left font-semibold">1지망</th>
                  <th className="px-4 py-4 text-left font-semibold">2지망</th>
                  <th className="px-4 py-4 text-left font-semibold">3지망</th>
                  <th className="px-4 py-4 text-left font-semibold">결제 방식</th>
                  <th className="px-4 py-4 text-left font-semibold">현재 상태</th>
                  <th className="px-4 py-4 text-left font-semibold">상태 변경</th>
                </tr>
              </thead>
              <tbody>
                {consultations.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-100 align-top hover:bg-amber-50/40"
                  >
                    <td className="px-4 py-4">{consultations.length - index}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {formatDateTime(item.created_at)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-medium">
                      {item.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">{item.phone}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{item.product}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {item.date1} {item.time1}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {item.date2} {item.time2}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {item.date3} {item.time3}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">{item.payment}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getStatusLabel(item.status)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusSelect
                        id={item.id}
                        initialStatus={item.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}