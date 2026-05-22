export type PageType = 'home' | 'archive' | 'category' | 'detail' | 'static';

export interface RouteManifestEntry {
  source_url: string;
  local_route: string;
  page_title: string;
  page_type: PageType;
  parent_page: string;
  template_used: string;
}

export interface CardItem {
  href: string;
  title: string;
  image: string | null;
  date: string | null;
  categories: string[];
}

export interface PageDetail {
  title: string;
  date: string | null;
  image: string | null;
  categories: string[];
  bodyHtml: string | null;
  excerpt: string | null;
  prev?: { href: string; label: string } | null;
  next?: { href: string; label: string } | null;
}

export interface PageData {
  route: string;
  sourceUrl: string;
  title: string;
  pageType: PageType;
  parentPage: string;
  template: string;
  cards: CardItem[];
  filters: { href: string; label: string }[];
  detail: PageDetail | null;
}
