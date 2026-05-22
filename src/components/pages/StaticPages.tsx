import Link from 'next/link';
import { ContactForm } from '@/components/contact/ContactForm';
import { WorldOfNumbers } from '@/components/animation/WorldOfNumbers';
import { feeInfo, strengths, faqPreview, companyInfo } from '@/data/static-content';
import type { PageData } from '@/lib/types';

export function StaticPages({ page }: { page: PageData }) {
  const slug = page.route.replace(/^\//, '');

  if (slug === 'contact') {
    return <ContactForm />;
  }

  if (slug === 'our-strength') {
    return (
      <div className="space-y-16">
        {strengths.map((s) => (
          <div key={s.reason} className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="aspect-[5/3] rounded-lg bg-gradient-to-br from-brand-blue/10 to-surface" />
            <div>
              <p className="text-sm font-bold text-brand-orange">{s.reason}</p>
              <h2 className="mt-2 text-xl font-bold">{s.title}</h2>
              <p className="mt-4 text-muted">{s.body}</p>
            </div>
          </div>
        ))}
        <WorldOfNumbers className="rounded-xl bg-surface">
          <div className="container-site py-16 text-center">
            <h2 className="section-en-title">Performance</h2>
            <p className="section-ja-title">実績</p>
            <p className="mt-2 text-xs text-muted">※過去5年間の実データに基づく</p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                { label: '累計ページ数', value: '150,000', unit: '頁以上' },
                { label: '累計クライアント数', value: '1,000', unit: '社以上' },
                { label: '累計プロジェクト数', value: '3,000', unit: '件以上' },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-white/90 p-6 shadow-md backdrop-blur">
                  <p className="text-sm text-muted">{item.label}</p>
                  <p className="mt-2 font-[family-name:var(--font-barlow)] text-4xl font-semibold italic text-brand-blue">
                    {item.value}
                  </p>
                  <p className="text-xs text-muted">{item.unit}</p>
                </div>
              ))}
            </div>
          </div>
        </WorldOfNumbers>
      </div>
    );
  }

  if (slug === 'services') {
    const services = [
      ['WordPress', 'WordPress構築は最多のCMS開発実績。複雑なカスタマイズも対応。'],
      ['Shopify', 'Shopifyカスタマイズの多数の実績があります。'],
      ['React / Next.js', '最新フレームワークによる高速・SEOに強いサイト構築。'],
      ['Web Animation', 'GSAP等を用いたリッチなアニメーション実装。'],
      ['EC-CUBE', 'フルカスタマイズによる高機能EC構築。'],
      ['要件定義・PM代行', '開発周りの要件定義・PM代行が可能です。'],
    ];
    return (
      <div className="grid gap-8 md:grid-cols-2">
        {services.map(([title, body]) => (
          <div key={title} id={title.toLowerCase().replace(/\s+/g, '-')} className="rounded-lg border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-brand-blue">{title}</h2>
            <p className="mt-3 text-sm text-muted">{body}</p>
          </div>
        ))}
      </div>
    );
  }

  if (slug === 'fee') {
    return (
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm text-muted">基本料金</p>
        <p className="mt-4 font-[family-name:var(--font-barlow)] text-5xl font-semibold italic text-brand-blue">
          {feeInfo.hourly}
          <span className="text-2xl not-italic">円</span>
          <span className="text-lg">/ 1時間</span>
        </p>
        <p className="mt-4 text-sm">EC開発の場合は {feeInfo.ecHourly}円 / 1時間</p>
        <p className="mt-8 text-sm text-muted">
          プロジェクト進行管理費用：全体の <strong className="text-brand-orange">{feeInfo.pmFee}%</strong>
        </p>
        <Link href="/blog/p3244" className="btn-primary mt-10 inline-flex">
          見積サンプルはこちら
        </Link>
      </div>
    );
  }

  if (slug === 'faq') {
    return (
      <div className="space-y-4">
        {faqPreview.map((item) => (
          <details key={item.q} className="group rounded-lg border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer font-bold text-ink group-open:text-brand-blue">{item.q}</summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    );
  }

  if (slug === 'company') {
    return (
      <dl className="space-y-4 text-sm">
        <div className="grid gap-2 border-b border-slate-100 py-3 md:grid-cols-3">
          <dt className="font-bold">会社名</dt>
          <dd className="md:col-span-2">{companyInfo.name}</dd>
        </div>
        <div className="grid gap-2 border-b border-slate-100 py-3 md:grid-cols-3">
          <dt className="font-bold">所在地</dt>
          <dd className="md:col-span-2">{companyInfo.address}</dd>
        </div>
        <div className="grid gap-2 border-b border-slate-100 py-3 md:grid-cols-3">
          <dt className="font-bold">電話</dt>
          <dd className="md:col-span-2">{companyInfo.tel}</dd>
        </div>
        <div className="grid gap-2 py-3 md:grid-cols-3">
          <dt className="font-bold">受付</dt>
          <dd className="md:col-span-2">{companyInfo.hours}</dd>
        </div>
      </dl>
    );
  }

  if (slug === 'privacy') {
    return (
      <div className="prose-site max-w-3xl text-sm">
        <p>アライブ株式会社（以下「当社」）は、お客様の個人情報を適切に保護するため、以下の方針に基づき管理いたします。</p>
        <h2>1. 個人情報の取得</h2>
        <p>お問い合わせフォーム等を通じて、必要な範囲で個人情報を取得します。</p>
        <h2>2. 利用目的</h2>
        <p>お問い合わせへの対応、サービス提供、品質向上のため利用します。</p>
        <h2>3. 第三者提供</h2>
        <p>法令に基づく場合を除き、同意なく第三者に提供しません。</p>
      </div>
    );
  }

  return <p className="text-muted">{page.title}</p>;
}
