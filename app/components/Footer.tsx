import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-bold text-white">
              Tiger Rich Company
            </h3>
            <p className="mt-4 text-sm leading-6">
              부동산 상담과 현장 방향 안내를 제공하는 상담 신청 사이트입니다.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/consult" className="hover:text-white">
                  상담 신청
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white">Contact</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>카카오톡: 오픈채팅방</li>
              <li>인스타그램: tiger.rich.company</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Tiger Rich Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
