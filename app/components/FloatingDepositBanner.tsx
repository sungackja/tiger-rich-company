export default function FloatingDepositBanner() {
  return (
    <aside
      aria-label="상담 신청 입금 안내"
      className="fixed inset-x-4 bottom-4 z-40 rounded-2xl border border-amber-200 bg-white/95 p-4 text-gray-950 shadow-2xl shadow-black/15 backdrop-blur md:inset-x-auto md:right-5 md:top-1/2 md:bottom-auto md:w-72 md:-translate-y-1/2"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
        신청 후 입금
      </p>
      <p className="mt-2 text-sm font-semibold leading-6 text-gray-700">
        신청 후 아래 계좌로 입금해주세요.
      </p>
      <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3">
        <p className="text-xs font-semibold text-amber-800">계좌</p>
        <p className="mt-1 text-base font-extrabold leading-7 text-gray-950">
          하나은행 130-910417-11207
        </p>
        <p className="text-sm font-bold leading-6 text-gray-900">
          김선영(어부야타이거)
        </p>
      </div>
      <p className="mt-3 text-sm font-semibold leading-6 text-red-700">
        이체까지 완료되어야 상담 신청이 접수됩니다.
      </p>
    </aside>
  );
}
