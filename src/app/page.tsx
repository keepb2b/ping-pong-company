import { HomePage } from '@/components/home/HomePage';
import { getPage } from '@/lib/routes';

export default function Page() {
  return (
    <HomePage
      workPreview={getPage('/work')?.cards.slice(0, 6) ?? []}
      animPreview={getPage('/animation')?.cards.slice(0, 4) ?? []}
      blogPreview={getPage('/blog')?.cards.slice(0, 4) ?? []}
    />
  );
}
