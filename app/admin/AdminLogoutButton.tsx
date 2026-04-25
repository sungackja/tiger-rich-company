"use client";

import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-2xl border border-gray-300 px-4 py-2 text-sm font-semibold transition hover:bg-gray-50"
    >
      로그아웃
    </button>
  );
}
