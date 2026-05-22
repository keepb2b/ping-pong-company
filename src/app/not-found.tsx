import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container-site flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="text-4xl font-bold text-brand-blue">404</h1>
      <p className="mt-4 text-muted">ページが見つかりませんでした。</p>
      <Link href="/" className="btn-primary mt-8">
        ホームへ戻る
      </Link>
    </main>
  );
}
