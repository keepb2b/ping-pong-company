export interface StaffMember {
  href: string;
  nameJa: string;
  nameEn: string;
  position: string;
  image: string;
}

export const staffCeo = {
  image: '/images/staff/ceo.png',
  nameJa: '代表取締役',
  nameEn: 'CEO',
  position: 'Representative Director',
} as const;

/** Featured team on the main staff page (first six from ALIVE JAPAN). */
export const staffFeatured: StaffMember[] = [
  {
    href: '/staff/p1927',
    nameJa: '伊藤 直実',
    nameEn: 'Naomi Ito',
    position: 'Web Developer / Manager / Sales Engineer',
    image: 'https://coding-alive.jp/wp/wp-content/uploads/2023/12/ito2-1.jpg',
  },
  {
    href: '/staff/p2101',
    nameJa: 'Pham Thi Giang',
    nameEn: 'ファン ティ ジャン',
    position: 'Communicator',
    image: 'https://coding-alive.jp/wp/wp-content/uploads/2024/01/download_file-2.jpg',
  },
  {
    href: '/staff/p991',
    nameJa: 'Fernando Souza',
    nameEn: 'フェルナンド ソウザ',
    position: 'Web Developer',
    image: 'https://coding-alive.jp/wp/wp-content/uploads/2022/07/fernando-02.jpg',
  },
  {
    href: '/staff/p913',
    nameJa: '玉木 柚衣',
    nameEn: 'Yui Tamaki',
    position: 'Web Developer',
    image: 'https://coding-alive.jp/wp/wp-content/uploads/2022/04/6D4A6742_tate.jpg',
  },
  {
    href: '/staff/p856',
    nameJa: '石川 理穂',
    nameEn: 'Riho Ishikawa',
    position: 'Web Developer / Sales Engineer',
    image: 'https://coding-alive.jp/wp/wp-content/uploads/2022/03/ishikawa_2.jpg',
  },
  {
    href: '/staff/p2120',
    nameJa: '夏 逸庭',
    nameEn: 'Hsia I-Ting',
    position: 'Web Developer',
    image: 'https://coding-alive.jp/wp/wp-content/uploads/2024/01/natsu_b.jpg',
  },
];
