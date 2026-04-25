"use client";

const products = [
  { name: "전화 상담 1시간", amount: 50000 },
  { name: "대면 상담 1시간", amount: 100000 },
  { name: "전화 상담 1시간 + After 1회", amount: 70000 },
  { name: "대면 상담 1시간 + After 1회", amount: 130000 },
  { name: "추가 상담 1시간", amount: 30000 },
];

function createOrderId() {
  return `order_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function createCustomerKey() {
  return `customer_${Math.random().toString(36).slice(2, 12)}`;
}

export default function PaymentsPage() {
  const selected = products[0];

  const handlePayment = async () => {
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

    if (!clientKey) {
      alert("TossPayments 클라이언트 키가 설정되지 않았습니다.");
      return;
    }

    const { loadTossPayments } = await import("@tosspayments/tosspayments-sdk");
    const tossPayments = await loadTossPayments(clientKey);
    const payment = tossPayments.payment({
      customerKey: createCustomerKey(),
    });

    await payment.requestPayment({
      method: "CARD",
      amount: {
        currency: "KRW",
        value: selected.amount,
      },
      orderId: createOrderId(),
      orderName: selected.name,
      successUrl: `${window.location.origin}/payments/success`,
      failUrl: `${window.location.origin}/payments/fail`,
      customerName: "상담 신청 고객",
    });
  };

  return (
    <main className="min-h-screen bg-[#f8f4e8] px-6 py-16">
      <div className="mx-auto max-w-xl rounded-[28px] bg-white p-8 shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Payment
        </p>
        <h1 className="mt-3 text-3xl font-bold">상담 결제</h1>
        <p className="mt-4 text-gray-600">
          상담 상품을 결제하고 신청을 완료합니다.
        </p>

        <div className="mt-8 rounded-2xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">상품명</p>
          <p className="mt-1 text-lg font-semibold">{selected.name}</p>

          <p className="mt-4 text-sm text-gray-500">결제 금액</p>
          <p className="mt-1 text-2xl font-bold">
            {selected.amount.toLocaleString()}원
          </p>
        </div>

        <button
          type="button"
          onClick={handlePayment}
          className="mt-8 w-full rounded-2xl bg-black px-6 py-4 font-semibold text-white transition hover:bg-gray-800"
        >
          결제하기
        </button>
      </div>
    </main>
  );
}
