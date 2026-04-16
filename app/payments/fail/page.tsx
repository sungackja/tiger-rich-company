type SearchParams = Promise<{
  code?: string;
  message?: string;
}>;

export default async function PaymentFailPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[#f8f4e8] px-6 py-16">
      <div className="mx-auto max-w-xl rounded-[32px] bg-white p-8 shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
          Payment Failed
        </p>
        <h1 className="mt-3 text-3xl font-bold">결제에 실패했습니다</h1>
        <p className="mt-4 text-gray-600">
          {params.message || "결제 중 문제가 발생했습니다."}
        </p>

        {params.code ? (
          <p className="mt-3 text-sm text-gray-500">오류코드: {params.code}</p>
        ) : null}
      </div>
    </main>
  );
}