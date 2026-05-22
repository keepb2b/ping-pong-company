'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks } from '@/lib/routes';

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="container-site flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="shrink-0" aria-label="NovaStack Technologies ホーム">
          <span className="font-[family-name:var(--font-barlow)] text-lg font-semibold italic tracking-tight text-brand-blue sm:text-xl md:text-2xl">
            NovaStack <span className="text-brand-orange">Technologies</span>
          </span>
        </Link>

        <div className="hidden items-center gap-3 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-medium text-ink transition hover:text-brand-blue"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="hidden rounded-full border border-brand-blue px-4 py-2 text-xs font-bold text-brand-blue transition hover:bg-brand-blue hover:text-white sm:inline-flex"
          >
            お問い合わせ
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded border border-slate-300 lg:hidden"
            aria-expanded={open}
            aria-label="メニューを開く"
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`h-0.5 w-5 bg-ink transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`h-0.5 w-5 bg-ink transition ${open ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-5 bg-ink transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-200 bg-white lg:hidden"
          >
            <ul className="flex flex-col gap-1 p-4">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded px-3 py-2 text-sm font-medium hover:bg-surface"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="btn-primary mt-2 w-full text-center" onClick={() => setOpen(false)}>
                  ご相談・お見積
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
