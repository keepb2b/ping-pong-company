import Image from 'next/image';
import Link from 'next/link';
import type { CardItem } from '@/lib/types';

export function ArchiveCard({ item, type }: { item: CardItem; type: 'work' | 'blog' | 'animation' | 'staff' }) {
  const aspect = type === 'animation' ? 'aspect-video' : 'aspect-[750/435]';

  return (
    <article className="card-hover group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <Link href={item.href} className="block">
        <div className={`relative ${aspect} overflow-hidden bg-surface`}>
          {item.image ? (
            <Image
              src={item.image}
              alt=""
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width:768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted">No image</div>
          )}
        </div>
        <div className="p-4">
          {item.date && <time className="text-xs text-muted">{item.date}</time>}
          <h3 className="mt-1 line-clamp-2 text-sm font-bold text-ink group-hover:text-brand-blue">{item.title}</h3>
          {item.categories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {item.categories.slice(0, 3).map((cat) => (
                <span key={cat} className="rounded bg-surface px-2 py-0.5 text-[10px] font-medium text-brand-blue">
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
