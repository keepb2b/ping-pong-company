# Route checklist — coding-alive.jp reproduction

**Crawled routes (raw):** 346  
**Unique routes (deduplicated):** 326  
**Implemented static pages (build):** 327 (home + 326 slug routes)

## Crawl summary

| Page type | Count (unique) |
|-----------|----------------|
| home | 1 |
| archive | 3 (`/work`, `/blog`, `/animation`) |
| detail | ~140 |
| category / pagination / tag | ~180 |
| static | 9 |

## Core static pages

| Reference URL | Local route | Status |
|---------------|-------------|--------|
| https://coding-alive.jp/ | `/` | ✅ Home (all 15 sections) |
| https://coding-alive.jp/our-strength/ | `/our-strength` | ✅ + World of Numbers on Performance |
| https://coding-alive.jp/services/ | `/services` | ✅ |
| https://coding-alive.jp/fee/ | `/fee` | ✅ |
| https://coding-alive.jp/faq/ | `/faq` | ✅ |
| https://coding-alive.jp/contact/ | `/contact` | ✅ Form + confirmation modal |
| https://coding-alive.jp/company/ | `/company` | ✅ |
| https://coding-alive.jp/privacy/ | `/privacy` | ✅ |
| https://coding-alive.jp/staff/ | `/staff` | ✅ Archive + detail |
| https://coding-alive.jp/work/ | `/work` | ✅ Archive + categories + details |
| https://coding-alive.jp/animation/ | `/animation` | ✅ |
| https://coding-alive.jp/blog/ | `/blog` | ✅ |

## Manifest file

Full list: `src/data/route-manifest.json` (also `scripts/route-manifest.json` from crawl).

## Features checklist

- [x] Header / footer / CTA blocks
- [x] Bilingual section titles (EN / JA)
- [x] Archive grids with category filters
- [x] Detail templates (breadcrumb, image, body, prev/next)
- [x] Contact form validation + confirm + mock submit
- [x] Scroll reveal (GSAP + Framer Motion)
- [x] World of Numbers immersive scroll (canvas + panel unfold)
- [x] `prefers-reduced-motion` fallback
- [x] `sitemap.xml` from manifest
- [x] Responsive layout (mobile / tablet / desktop)
- [x] `next/image` for remote assets

## Run locally

```bash
npm install
npm run extract   # refresh content from scripts/cache (after crawl)
npm run dev
```

## Re-crawl reference site

```bash
npm run crawl
npm run extract
```
