import { redirect } from "next/navigation";

type SearchParams = Promise<{
  paymentKey?: string;
  orderId?: string;
  amount?: string;
}>;

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const paymentKey = params.paymentKey;
  const orderId = params.orderId;
  const amount = params.amount;

  if (!paymentKey || !orderId || !amount) {
    redirect(
      `/payments/fail?message=${encodeURIComponent(
        "필수 결제 정보가 없습니다."
      )}`
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${siteUrl}/api/payments/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      paymentKey,
      orderId,
      amount: Number(amount),
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    redirect(
      `/payments/fail?message=${encodeURIComponent(
        data.message || "결제 승인에 실패했습니다."
      )}`
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f4e8] px-6 py-16">
      <div className="mx-auto max-w-xl rounded-[28px] bg-white p-8 shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Payment Success
        </p>
        <h1 className="mt-3 text-3xl font-bold">결제가 완료되었습니다</h1>
        <p className="mt-4 text-gray-600">
          상담 신청이 정상적으로 접수되었습니다.
        </p>

        <div className="mt-8 rounded-2xl border border-gray-200 p-5 text-sm text-gray-700">
          <p>주문번호: {orderId}</p>
          <p className="mt-2">결제금액: {Number(amount).toLocaleString()}원</p>
        </div>
      </div>
    </main>
  );
}
