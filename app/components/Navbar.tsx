import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-gray-900"
        >
          <span className="text-2xl">🐯</span>
          <span>Tiger Rich Company</span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6 text-sm font-medium text-gray-700">
          <Link href="/" className="transition hover:text-black">
            홈
          </Link>
          <a href="#products" className="transition hover:text-black">
            상품 안내
          </a>
          <Link
            href="/consult"
            className="rounded-full bg-black px-4 py-2 text-white transition hover:bg-gray-800"
          >
            상담 신청
          </Link>
        </nav>
      </div>
    </header>
  );
}