import https from 'https';
import { URL } from 'url';

const BASE = 'https://coding-alive.jp';
const visited = new Set();
const queue = [BASE + '/'];
const links = new Map();

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
      },
      timeout: 20000,
    }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        let loc = res.headers.location;
        if (!loc.startsWith('http')) loc = new URL(loc, url).href;
        return resolve(fetch(loc));
      }
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ url, html: data, status: res.statusCode }));
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('timeout'));
    });
  });
}

function normalize(u) {
  try {
    const parsed = new URL(u, BASE);
    if (parsed.hostname !== 'coding-alive.jp') return null;
    let path = parsed.pathname || '/';
    if (path !== '/' && !path.endsWith('/') && !/\.[a-z0-9]+$/i.test(path)) {
      path += '/';
    }
    const skipExt = /\.(pdf|jpg|jpeg|png|gif|svg|webp|mp4|zip|css|js|woff2?|ttf|ico)$/i;
    if (skipExt.test(path)) return null;
    if (path.includes('/wp-admin') || path.includes('/wp-login')) return null;
    return parsed.origin + path;
  } catch {
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
  while (queue.length > 0 && visited.size < 250) {
    const key = normalize(queue.shift());
    if (!key || visited.has(key)) continue;
    visited.add(key);
    try {
      const { html, status } = await fetch(key);
      if (status !== 200) {
        console.log('SKIP', status, key);
        continue;
      }
      const title = extractTitle(html);
      links.set(key, { title, status });
      const found = extractLinks(html);
      for (const l of found) {
        if (!visited.has(l) && !queue.includes(l)) queue.push(l);
      }
      console.log('OK', visited.size, key);
    } catch (e) {
      console.log('ERR', key, e.message);
    }
  }
  console.log('\n=== TOTAL:', links.size, '===');
  const sorted = [...links.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  for (const [u, info] of sorted) {
    console.log(u + '\t' + info.title);
  }
}

crawl();
