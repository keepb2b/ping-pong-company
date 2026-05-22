'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Reveal } from '@/components/motion/Reveal';
import { ScrollSection } from '@/components/motion/ScrollSection';
import { HeroCylinderTunnel } from '@/components/animation/HeroCylinderTunnel';
import { WorldOfNumbers } from '@/components/animation/WorldOfNumbers';
import { ArchiveCard } from '@/components/cards/ArchiveCard';
import type { CardItem } from '@/lib/types';
import { concerns, reasons, servicesHome, faqPreview, feeInfo } from '@/data/static-content';

export interface HomePageProps {
  workPreview?: CardItem[];
  animPreview?: CardItem[];
  blogPreview?: CardItem[];
}

const voices = [
  {
    company: '東京のブランディング会社 様',
    title: 'Web技術のアイディアを提案していただき、ブランディングに集中することができます。',
  },
  {
    company: '名古屋のデザイン会社 様',
    title: '無理なお願いにも120％で応えてくれ、技術も人柄もよく、気持ちよくお仕事が出来ます。',
  },
];

export function HomePage({
  workPreview = [],
  animPreview = [],
  blogPreview = [],
}: HomePageProps) {
  return (
    <main>
      {/* Hero */}
      <ScrollSection
        sectionIndex={0}
        className="relative overflow-hidden bg-gradient-to-b from-[#e8f4fc] via-white to-white pb-20 pt-12 md:pt-20"
      >
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-medium text-muted">
              テクニカルなコーディング・AI / WEB
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
              構想を飛び越えて...
            </h1>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Shopify', 'AI', 'WordPress', 'Next.js', 'アニメーション'].map((tag) => (
                <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-bold shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary">
                ご相談・お見積
              </Link>
              <Link href="/fee" className="btn-outline">
                料金を見る
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="mx-auto w-full max-w-md">
            <HeroCylinderTunnel />
          </Reveal>
        </div>
      </ScrollSection>

      {/* Performance / World of Numbers */}
      <WorldOfNumbers className="min-h-[420px] bg-surface">
        <div className="container-site py-16">
          <Reveal>
            <h2 className="section-en-title text-center">Performance</h2>
            <p className="section-ja-title text-center">実績</p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { label: '累計ページ数', value: '150,000' },
              { label: '累計クライアント数', value: '1,000' },
              { label: '累計プロジェクト数', value: '3,000' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl bg-white/90 p-8 text-center shadow-lg backdrop-blur"
              >
                <p className="text-sm text-muted">{item.label}</p>
                <p className="mt-2 font-[family-name:var(--font-barlow)] text-4xl font-semibold italic text-brand-blue md:text-5xl">
                  {item.value}
                </p>
                <p className="text-xs text-muted">以上</p>
              </motion.div>
            ))}
          </div>
        </div>
      </WorldOfNumbers>

      {/* Concerns */}
      <ScrollSection sectionIndex={2} className="bg-surface py-16">
        <div className="container-site">
          <Reveal>
            <h2 className="section-en-title">What&apos;s Your Concern</h2>
            <p className="section-ja-title">なくならないコーディングの悩み…</p>
          </Reveal>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {concerns.map((c, i) => (
              <motion.li
                key={c}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium shadow-sm"
              >
                {c}
              </motion.li>
            ))}
          </ul>
        </div>
      </ScrollSection>

      {/* Reasons */}
      <ScrollSection sectionIndex={3} className="py-16">
        <div className="container-site">
          <Reveal>
            <h2 className="section-en-title">Reasons to be chosen</h2>
            <p className="section-ja-title">選ばれる理由</p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r) => (
              <div key={r.n} className="card-hover rounded-lg border border-slate-200 p-6">
                <span className="text-2xl font-bold text-brand-orange">{r.n}</span>
                <p className="mt-3 text-sm font-bold">{r.title}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/our-strength" className="btn-outline">
              選ばれる理由をさらに読む
            </Link>
          </div>
        </div>
      </ScrollSection>

      {/* Services */}
      <ScrollSection sectionIndex={4} tone="blue" className="bg-brand-blue py-16 text-white">
        <div className="container-site">
          <Reveal>
            <h2 className="font-[family-name:var(--font-barlow)] text-4xl font-semibold italic">Services</h2>
            <p className="mt-1 text-brand-orange">サービス</p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {servicesHome.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="card-hover block rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur"
              >
                <p className="text-xs text-white/70">{s.en}</p>
                <p className="mt-2 font-bold">{s.ja}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/services" className="btn-primary bg-white text-brand-blue hover:bg-slate-100">
              サービスをさらに読む
            </Link>
          </div>
        </div>
      </ScrollSection>

      {/* Fee preview */}
      <ScrollSection sectionIndex={5} className="py-16">
        <div className="container-site text-center">
          <h2 className="section-en-title">Basic Charge</h2>
          <p className="section-ja-title">基本料金</p>
          <p className="mt-8 font-[family-name:var(--font-barlow)] text-5xl font-semibold italic text-brand-blue">
            {feeInfo.hourly}円<span className="text-lg not-italic">/時間</span>
          </p>
          <Link href="/fee" className="btn-outline mt-8 inline-flex">
            詳細な料金やオプションを読む
          </Link>
        </div>
      </ScrollSection>

      {/* Works */}
      <ScrollSection sectionIndex={6} className="bg-surface py-16">
        <div className="container-site">
          <h2 className="section-en-title">Development cases</h2>
          <p className="section-ja-title">開発事例</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workPreview.map((card) => (
              <ArchiveCard key={card.href} item={card} type="work" />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/work" className="btn-outline">
              開発事例をさらに読む
            </Link>
          </div>
        </div>
      </ScrollSection>

      {/* Animation */}
      <ScrollSection sectionIndex={7} className="py-16">
        <div className="container-site">
          <h2 className="section-en-title">Animations</h2>
          <p className="section-ja-title">アニメーションサンプル</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {animPreview.map((card) => (
              <ArchiveCard key={card.href} item={card} type="animation" />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/animation" className="btn-outline">
              サンプルをさらに読む
            </Link>
          </div>
        </div>
      </ScrollSection>

      {/* User voice */}
      <ScrollSection sectionIndex={8} className="bg-surface py-16">
        <div className="container-site">
          <h2 className="section-en-title">User Voice</h2>
          <p className="section-ja-title">お客様の声</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {voices.map((v) => (
              <blockquote key={v.company} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold text-brand-orange">{v.company}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{v.title}</p>
              </blockquote>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* FAQ preview */}
      <ScrollSection sectionIndex={9} className="py-16">
        <div className="container-site max-w-3xl">
          <h2 className="section-en-title text-center">FAQ</h2>
          <p className="section-ja-title text-center">よくあるご質問</p>
          <div className="mt-10 space-y-3">
            {faqPreview.map((f) => (
              <details key={f.q} className="rounded-lg border border-slate-200 bg-white p-4">
                <summary className="cursor-pointer text-sm font-bold">{f.q}</summary>
                <p className="mt-2 text-sm text-muted">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/faq" className="btn-outline">
              FAQをさらに読む
            </Link>
          </div>
        </div>
      </ScrollSection>

      {/* Blog */}
      <ScrollSection sectionIndex={10} className="bg-surface py-16">
        <div className="container-site">
          <h2 className="section-en-title">Development blog</h2>
          <p className="section-ja-title">開発ブログ</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {blogPreview.map((card) => (
              <ArchiveCard key={card.href} item={card} type="blog" />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/blog" className="btn-outline">
              ブログをさらに読む
            </Link>
          </div>
        </div>
      </ScrollSection>

      {/* Who we are */}
      <ScrollSection sectionIndex={11} className="py-16">
        <div className="container-site grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="section-en-title">Who We Are</h2>
            <p className="section-ja-title">私たちについて</p>
            <p className="mt-6 text-sm leading-relaxed text-muted">
              アライブ株式会社は、2001年に設立。名古屋・ベトナムに拠点を持ち、Webサイト開発技術者が50名以上在籍しています。
              コーディングの外注・代行により、制作会社様の負担を取り除きます。
            </p>
            <Link href="/company" className="btn-outline mt-6 inline-flex">
              会社概要
            </Link>
          </div>
          <div className="aspect-video rounded-xl bg-gradient-to-br from-brand-blue/20 to-surface" />
        </div>
      </ScrollSection>

      {/* CTA */}
      <ScrollSection sectionIndex={12} tone="blue" className="bg-brand-blue py-16 text-center text-white">
        <div className="container-site">
          <h2 className="text-2xl font-bold">まずはお気軽にご相談ください</h2>
          <p className="mt-3 text-sm text-white/80">エンジニア経験者がお受けします</p>
          <Link href="/contact" className="btn-primary mt-8 bg-brand-orange">
            ご相談・お見積
          </Link>
        </div>
      </ScrollSection>
    </main>
  );
}
