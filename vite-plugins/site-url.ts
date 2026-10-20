import fs from 'node:fs';
import path from 'node:path';
import {DOWNLOADS} from '../src/constants';
import {loadEnv, type Plugin, type ResolvedConfig} from 'vite';

/**
 * 사이트 주소(VITE_SITE_URL)를 한 곳에서 관리한다.
 *
 * - index.html과 public/*.html 안의 `%SITE_URL%`을 빌드 때 실제 주소로 바꾼다.
 * - 주소가 필요한 태그에는 `data-needs-site-url` 속성을 붙여 둔다. 주소가 비어 있으면
 *   그 태그를 통째로 지우고(임시 도메인을 박지 않는다), 있으면 속성만 떼어 낸다.
 * - dist에 실제로 있는 페이지만 담아 sitemap.xml과 robots.txt를 만든다. 주소가 없으면 sitemap은 만들지 않는다.
 */
const TOKEN = '%SITE_URL%';
const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const NEEDS_ATTR = 'data-needs-site-url';

function normalize(raw: string | undefined, warn: (message: string) => void): string {
  const value = (raw ?? '').trim().replace(/\/+$/, '');
  if (!value) return '';
  if (!/^https?:\/\/[^\s"'<>&]+$/.test(value)) {
    warn(`VITE_SITE_URL 값이 http(s)로 시작하는 주소가 아니라서 무시해요: ${value}`);
    return '';
  }
  return value;
}

export function applySiteUrl(html: string, siteUrl: string): string {
  if (!siteUrl) {
    return html.replace(new RegExp(`[ \t]*<[^<>]*${NEEDS_ATTR}[^<>]*>[ \t]*\r?\n?`, 'g'), '');
  }
  return html
    .split(TOKEN).join(siteUrl)
    .replace(new RegExp(String.raw`\s+${NEEDS_ATTR}(?=[\s/>])`, 'g'), '');
}

/** noscript 요약 안의 다운로드 주소·버전도 src/constants.ts의 DOWNLOADS 한 곳에서 가져온다. */
function applyDownloads(html: string): string {
  return html
    .split('%DL_WINDOWS_URL%').join(DOWNLOADS.windows.url)
    .split('%DL_WINDOWS_VERSION%').join(DOWNLOADS.windows.version)
    .split('%DL_MAC_URL%').join(DOWNLOADS.mac.url)
    .split('%DL_MAC_VERSION%').join(DOWNLOADS.mac.version);
}

export function siteUrlPlugin(): Plugin {
  let config: ResolvedConfig;
  let siteUrl = '';

  return {
    name: 'choeae-site-url',
    configResolved(resolved) {
      config = resolved;
      const env = loadEnv(resolved.mode, resolved.envDir, 'VITE_');
      siteUrl = normalize(env.VITE_SITE_URL, (message) => resolved.logger.warn(`[site-url] ${message}`));
      if (!siteUrl) {
        resolved.logger.warn(
          '[site-url] VITE_SITE_URL이 비어 있어요. canonical, og:url, og:image, sitemap.xml은 만들지 않아요.',
        );
      }
    },
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => applyDownloads(applySiteUrl(html, siteUrl)),
    },
    closeBundle: {
      order: 'post',
      sequential: true,
      handler() {
        if (config.command !== 'build') return;
        const outDir = path.resolve(config.root, config.build.outDir);
        if (!fs.existsSync(outDir)) return;

        const pages = fs.readdirSync(outDir).filter((name) => name.endsWith('.html')).sort();
        for (const name of pages) {
          const file = path.join(outDir, name);
          fs.writeFileSync(file, applySiteUrl(fs.readFileSync(file, 'utf-8'), siteUrl));
        }

        const robots = ['User-agent: *', 'Allow: /'];
        if (siteUrl) {
          const urls = pages.map((name) => (name === 'index.html' ? `${siteUrl}/` : `${siteUrl}/${name}`));
          const sitemap = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            ...urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`),
            '</urlset>',
            '',
          ].join('\n');
          fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap);
          robots.push(`Sitemap: ${siteUrl}/sitemap.xml`);
        }
        fs.writeFileSync(path.join(outDir, 'robots.txt'), `${robots.join('\n')}\n`);
      },
    },
  };
}
