import fs from 'fs';
import path from 'path';

const ROOT = path.join(import.meta.dirname, '..');
const CACHE = path.join(import.meta.dirname, 'cache');
const manifestRaw = fs.readFileSync(path.join(import.meta.dirname, 'route-manifest.json'), 'utf8');
const manifest = JSON.parse(manifestRaw.replace(/^\uFEFF/, ''));

function cacheFileForUrl(url) {
  const safe = url.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 80);
  const exact = path.join(CACHE, `${safe}.html`);
  if (fs.existsSync(exact)) return exact;
  const files = fs.readdirSync(CACHE);
  const host = url.replace('https://coding-alive.jp', '').replace(/\/$/, '') || '/';
  const match = files.find((f) => f.includes(host.replace(/\//g, '_').slice(1, 40)));
  return match ? path.join(CACHE, match) : null;
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractCards(html, type) {
  const items = [];
  const className =
    type === 'work' ? 'work-item' : type === 'blog' ? 'blog-item' : type === 'animation' ? 'animation-item' : 'staff-item';
  const re = new RegExp(`<div class="${className}"[\\s\\S]*?</div>\\s*</div>\\s*</div>`, 'gi');
  let block;
  const simpleRe =
    type === 'work'
      ? /<div class="work-item">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi
      : type === 'blog'
        ? /<div class="blog-item">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi
        : type === 'animation'
          ? /<div class="animation-item">([\s\S]*?)<\/div>\s*<\/div>/gi
          : /<div class="staff-item">([\s\S]*?)<\/div>\s*<\/div>/gi;

  while ((block = simpleRe.exec(html)) !== null) {
    const chunk = block[0];
    const hrefM = chunk.match(/href="(https:\/\/coding-alive\.jp\/[^"]+)"/);
    const titleM = chunk.match(/class="(?:work|blog|animation|staff)-title[^"]*"[^>]*>\s*<a[^>]*>([^<]+)</) ||
      chunk.match(/<a href="[^"]+">([^<]+)<\/a>/);
    const imgM = chunk.match(/data-src="([^"]+)"/) || chunk.match(/src="(https:\/\/coding-alive\.jp\/wp[^"]+)"/);
    const dateM = chunk.match(/class="[^"]*date[^"]*"[^>]*>([^<]+)</);
    const cats = [...chunk.matchAll(/class="(?:primary-cat|cat)[^"]*"[^>]*>([^<]*)</g)].map((m) => m[1].trim()).filter(Boolean);
    if (hrefM) {
      items.push({
        href: hrefM[1].replace('https://coding-alive.jp', ''),
        title: titleM ? titleM[1].trim() : 'Untitled',
        image: imgM ? imgM[1] : null,
        date: dateM ? dateM[1].trim() : null,
        categories: cats,
      });
    }
  }
  return items;
}

function extractDetail(html) {
  const titleM =
    html.match(/<h2 class="single-title">([^<]+)</) ||
    html.match(/<h1[^>]*class="[^"]*single-title[^"]*"[^>]*>([^<]+)</) ||
    html.match(/<meta property="og:title" content="([^"]+)"/);
  const dateM = html.match(/<div class="date-cat">\s*<strong>([^<]+)</) || html.match(/<time[^>]*datetime="([^"]+)"/);
  const imgM =
    html.match(/<div class="main-image">[\s\S]*?<img src="([^"]+)"/) ||
    html.match(/<meta property="og:image" content="([^"]+)"/);
  const cmsParts = [...html.matchAll(/<div class="cmsContent">([\s\S]*?)<\/div>/gi)].map((m) => m[1].trim());
  const bodyHtml = cmsParts.length ? cmsParts.join('\n') : null;
  const catBlock = html.match(/<div class="date-cat">([\s\S]*?)<\/div>/);
  const cats = catBlock
    ? [...catBlock[1].matchAll(/<a[^>]*>([^<]+)<\/a>/g)].map((m) => m[1].trim())
    : [];
  const prevM = html.match(/class="previous-post"[\s\S]*?<a href="([^"]+)"[^>]*>([^<]*)</);
  const nextM = html.match(/class="next-post"[\s\S]*?<a href="([^"]+)"[^>]*>([^<]*)</);
  return {
    title: titleM ? titleM[1].replace(/\s*\|.*$/, '').trim() : '',
    date: dateM ? dateM[1].trim() : null,
    image: imgM ? imgM[1] : null,
    categories: cats,
    bodyHtml,
    excerpt: bodyHtml ? stripHtml(bodyHtml).slice(0, 280) : null,
    prev: prevM ? { href: prevM[1].replace('https://coding-alive.jp', ''), label: prevM[2].trim() } : null,
    next: nextM ? { href: nextM[1].replace('https://coding-alive.jp', ''), label: nextM[2].trim() } : null,
  };
}

function extractFilters(html) {
  const filters = [];
  const re = /<li class="[^"]*"><a href="(https:\/\/coding-alive\.jp\/[^"]+)"[^>]*>([^<]*)</gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (m[1].includes('cat') || m[1].includes('/work/') || m[1].includes('/animation')) {
      filters.push({ href: m[1].replace('https://coding-alive.jp', ''), label: m[2].trim() });
    }
  }
  return filters.slice(0, 30);
}

const pages = manifest.map((route) => {
  const file = cacheFileForUrl(route.source_url);
  const html = file && fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  const base = {
    route: route.local_route,
    sourceUrl: route.source_url,
    title: route.page_title,
    pageType: route.page_type,
    parentPage: route.parent_page,
    template: route.template_used,
  };

  if (!html) return { ...base, cards: [], filters: [], detail: null };

  let cards = [];
  if (route.template_used?.includes('work')) cards = extractCards(html, 'work');
  if (route.template_used?.includes('blog')) cards = extractCards(html, 'blog');
  if (route.template_used?.includes('animation')) cards = extractCards(html, 'animation');
  if (route.template_used === 'static-page' && route.local_route.includes('/staff')) {
    cards = extractCards(html, 'staff');
  }

  const detail = route.page_type === 'detail' ? extractDetail(html) : null;
  const filters = route.page_type === 'archive' || route.page_type === 'category' ? extractFilters(html) : [];

  return { ...base, cards, filters, detail };
});

fs.mkdirSync(path.join(ROOT, 'src', 'data'), { recursive: true });
fs.copyFileSync(
  path.join(import.meta.dirname, 'route-manifest.json'),
  path.join(ROOT, 'src', 'data', 'route-manifest.json')
);
fs.writeFileSync(path.join(ROOT, 'src', 'data', 'pages-index.json'), JSON.stringify(pages, null, 0));
console.log('Extracted', pages.length, 'pages');
console.log('With cards:', pages.filter((p) => p.cards?.length).length);
console.log('With detail:', pages.filter((p) => p.detail?.bodyHtml).length);
