import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const BASE = 'https://coding-alive.jp';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0';
const visited = new Set();
const queue = [BASE + '/'];
const pages = new Map();
const cacheDir = join(import.meta.dirname, 'cache');

if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });

function normalize(u) {
  try {
    const parsed = new URL(u, BASE);
    if (parsed.hostname !== 'coding-alive.jp') return null;
    let path = parsed.pathname || '/';
    if (/\.(pdf|jpg|jpeg|png|gif|svg|webp|mp4|zip|css|js|woff2?|ttf|ico)$/i.test(path)) return null;
    if (path.includes('/wp-admin') || path.includes('/wp-content') || path.includes('/assets/')) return null;
    if (!path.endsWith('/') && !/\.[a-z0-9]+$/i.test(path) && !path.includes('/p')) {
      // keep trailing slash for dirs except post slugs like /work/p123/
    }
    return parsed.origin + path;
  } catch {
    return null;
  }
}

function fetch(url) {
  const key = url.replace(/[^a-z0-9]+/gi, '_').slice(0, 120);
  const file = join(cacheDir, key + '.html');
  try {
    execSync(
      `curl.exe -sL -A "${UA}" "${url}" -o "${file}" -w "%{http_code}"`,
      { encoding: 'utf8', timeout: 30000 }
    );
    const status = execSync(`curl.exe -sL -A "${UA}" "${url}" -o NUL -w "%{http_code}"`, {
      encoding: 'utf8',
      timeout: 30000,
    }).trim();
    if (!existsSync(file)) return null;
    const html = require('fs').readFileSync(file, 'utf8');
    return { status: Number(status) || 200, html };
  } catch (e) {
    return null;
  }
}

function extractLinks(html) {
  const found = [];
  const re = /href=["']([^"'#]+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const n = normalize(m[1]);
    if (n) found.push(n);
  }
  return found;
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? m[1].trim() : '';
}

async function crawl() {
  while (queue.length > 0 && visited.size < 300) {
    const key = normalize(queue.shift());
    if (!key || visited.has(key)) continue;
    visited.add(key);
    const result = fetch(key);
    if (!result || result.status !== 200) {
      console.log('SKIP', key, result?.status);
      continue;
    }
    const title = extractTitle(result.html);
    pages.set(key, { title });
    const found = extractLinks(result.html);
    for (const l of found) {
      if (!visited.has(l) && !queue.includes(l)) queue.push(l);
    }
    console.log('OK', visited.size, key);
  }

  const sorted = [...pages.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const manifest = sorted.map(([url, info]) => {
    const path = new URL(url).pathname;
    let pageType = 'static';
    let parent = '/';
    let template = 'static-page';

    if (path === '/' || path === '') {
      pageType = 'home';
      template = 'home';
    } else if (path === '/work/' || path === '/work') {
      pageType = 'archive';
      template = 'work-archive';
    } else if (path.match(/^\/work\/p\d+\/?$/)) {
      pageType = 'detail';
      parent = '/work/';
      template = 'work-detail';
    } else if (path.startsWith('/work/')) {
      pageType = 'category';
      parent = '/work/';
      template = 'work-category';
    } else if (path === '/animation/' || path === '/animation') {
      pageType = 'archive';
      template = 'animation-archive';
    } else if (path.match(/^\/animation\/p\d+\/?$/)) {
      pageType = 'detail';
      parent = '/animation/';
      template = 'animation-detail';
    } else if (path.startsWith('/animation/')) {
      pageType = 'category';
      parent = '/animation/';
      template = 'animation-category';
    } else if (path === '/blog/' || path === '/blog') {
      pageType = 'archive';
      template = 'blog-archive';
    } else if (path.match(/^\/blog\/p\d+\/?$/)) {
      pageType = 'detail';
      parent = '/blog/';
      template = 'blog-detail';
    } else if (path.startsWith('/blogcat/')) {
      pageType = 'category';
      parent = '/blog/';
      template = 'blog-category';
    }

    return {
      source_url: url,
      local_route: path.endsWith('/') && path !== '/' ? path.slice(0, -1) || '/' : path || '/',
      page_title: info.title,
      page_type: pageType,
      parent_page: parent,
      template_used: template,
    };
  });

  writeFileSync(join(import.meta.dirname, 'route-manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('\n=== TOTAL:', manifest.length, '===');
  for (const r of manifest) {
    console.log(r.local_route + '\t' + r.page_type + '\t' + r.page_title.slice(0, 50));
  }
}

crawl();
