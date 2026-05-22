import type { Metadata } from 'next';
import { Noto_Sans_JP, Barlow } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MotionProvider } from '@/components/motion/MotionProvider';
import './globals.css';

const noto = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto',
});

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['600'],
  style: ['italic'],
  variable: '--font-barlow',
});

export const metadata: Metadata = {
  title: {
    default: 'コーディング外注・代行ならコーディングアライブ',
    template: '%s | コーディングアライブ',
  },
  description:
    '名古屋のコーディング代行・外注。WordPress、Shopify、ECサイト、アニメーション実装の実績多数。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${noto.variable} ${barlow.variable}`}>
      <body>
        <MotionProvider>
          <Header />
          {children}
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
