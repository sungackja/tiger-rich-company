import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          
          {/* 브랜드 정보 */}
          <div>
            <h3 className="text-xl font-bold text-white">
              🐯 Tiger Rich Company
            </h3>
            <p className="mt-4 text-sm leading-6">
              부동산 상담 전문 플랫폼으로,
              고객 맞춤형 전략을 제공합니다.
            </p>
          </div>

          {/* 빠른 링크 */}
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
              <li>
                <a href="#products" className="hover:text-white">
                  상담 상품
                </a>
              </li>
            </ul>
          </div>

          {/* 연락처 정보 */}
          <div>
            <h4 className="text-lg font-semibold text-white">Contact</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>📞 전화: 010-0000-0000</li>
              <li>📧 이메일: tiger@richcompany.com</li>
              <li>💬 카카오톡: Tiger Rich Company</li>
            </ul>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Tiger Rich Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
}