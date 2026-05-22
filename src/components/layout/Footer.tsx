import Link from 'next/link';
import { navLinks } from '@/lib/routes';

export function Footer() {
  return (
    <footer className="mt-20 bg-ink text-white">
      <div className="bg-brand-blue py-12">
        <div className="container-site text-center">
          <p className="font-[family-name:var(--font-barlow)] text-2xl font-semibold italic">Consultation / Quotation</p>
          <p className="mt-2 text-sm text-white/90">お見積もり・疑問点などお気軽にご相談ください</p>
          <a href="tel:0344008755" className="mt-4 inline-block text-3xl font-bold tracking-wide">
            03-4400-8755
          </a>
          <p className="mt-2 text-xs text-white/80">［受付時間］10:00〜19:00 ［定休日］土・日・祝日</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary">
              ご相談・お見積り
            </Link>
          </div>
        </div>
      </div>

      <div className="container-site grid gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="font-[family-name:var(--font-barlow)] text-xl font-semibold italic">
            NovaStack <span className="text-brand-orange">Technologies</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/75">
            本社 〒171-0031
            <br />
            東京都豊島区目白4-13-3 大和ビル2F
          </p>
        </div>
        <nav aria-label="フッターナビゲーション">
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/80 transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="text-white/80 transition hover:text-white">
                お問い合わせ
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-white/80 transition hover:text-white">
                プライバシーポリシー
              </Link>
            </li>
          </ul>
        </nav>
        <div className="text-sm text-white/70">
          <p>コーディングの外注・代行サービス</p>
          <p className="mt-4">Copyright © NovaStack Technologies</p>
        </div>
      </div>
    </footer>
  );
}
