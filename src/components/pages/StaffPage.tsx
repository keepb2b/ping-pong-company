'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ScrollSection } from '@/components/motion/ScrollSection';
import { staffCeo, staffFeatured, type StaffMember } from '@/data/staff-content';

function StaffCard({ member }: { member: StaffMember }) {
  return (
    <Link
      href={member.href}
      className="card-hover group block overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
    >
      <div className="relative aspect-[27/20] overflow-hidden bg-surface">
        <Image
          src={member.image}
          alt={member.nameJa}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4">
        <p className="text-sm font-bold text-ink group-hover:text-brand-blue">
          <span>{member.nameJa}</span>
          <span className="mt-0.5 block text-xs font-normal text-muted">{member.nameEn}</span>
        </p>
        <p className="mt-2 text-xs text-muted">{member.position}</p>
      </div>
    </Link>
  );
}

export function StaffPage() {
  return (
    <>
      <ScrollSection sectionIndex={0} effect="diagonal-cross" className="py-12">
        <div className="container-site">
          <article className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
            <div className="relative aspect-square w-full bg-surface">
              <Image
                src={staffCeo.image}
                alt={staffCeo.nameJa}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
              />
            </div>
            <div className="border-t border-slate-100 px-6 py-5 text-center">
              <p className="text-xs font-bold tracking-widest text-brand-orange">CEO</p>
              <h2 className="mt-1 text-xl font-bold text-ink">{staffCeo.nameJa}</h2>
              <p className="text-sm text-muted">{staffCeo.position}</p>
            </div>
          </article>
        </div>
      </ScrollSection>

      <ScrollSection sectionIndex={1} effect="paper-scrap" className="bg-surface py-12">
        <div className="container-site">
          <p className="text-center text-sm font-bold text-brand-blue">ALIVE JAPAN</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {staffFeatured.map((member) => (
              <StaffCard key={member.href} member={member} />
            ))}
          </div>
        </div>
      </ScrollSection>
    </>
  );
}
