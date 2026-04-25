"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  id: number;
  initialStatus: string;
};

const statusOptions = [
  { value: "pending", label: "접수 완료" },
  { value: "confirmed", label: "일정 확정" },
  { value: "completed", label: "상담 완료" },
  { value: "cancelled", label: "취소" },
];

export default function StatusSelect({ id, initialStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (nextStatus: string) => {
    setStatus(nextStatus);
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/consultations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "상태 변경에 실패했습니다.");
        setStatus(initialStatus);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Status update error:", error);
      alert("상태 변경 중 오류가 발생했습니다.");
      setStatus(initialStatus);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status}
      onChange={(e) => void handleChange(e.target.value)}
      disabled={loading}
      className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100 disabled:opacity-60"
    >
      {statusOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {loading && option.value === status ? "변경 중..." : option.label}
        </option>
      ))}
    </select>
  );
}
