// app/components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          🐯 Tiger Rich Company
        </Link>
        <nav className="flex gap-6 text-sm font-medium">
          <Link href="/">홈</Link>
          <Link href="/consult">상담 신청</Link>
        </nav>
      </div>
    </header>
  );
}