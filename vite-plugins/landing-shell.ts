import {createElement} from 'react';
import {renderToString} from 'react-dom/server';
import {createServer, type Plugin, type ViteDevServer} from 'vite';
import {SITE_MAINTENANCE} from '../src/constants';

const MARK = '<!--LANDING_SHELL-->';

const MAINTENANCE_STYLE = `<style>
      html { color-scheme: light dark; }
      body { margin: 0; min-height: 100svh; display: grid; place-items: center; padding: 24px 20px; box-sizing: border-box; background: #f4f4f4; color: #111; font-family: system-ui, -apple-system, 'Segoe UI', 'Malgun Gothic', sans-serif; text-align: center; line-height: 1.65; }
      @media (prefers-color-scheme: dark) { body { background: #0f0f10; color: #f2f2f2; } }
      h1 { margin: 0 0 8px; font-size: 22px; }
      p { margin: 0; font-size: 18px; }
      nav { margin-top: 28px; font-size: 14px; }
      nav a { color: inherit; margin: 0 8px; }
    </style>`;

/**
 * SITE_MAINTENANCE가 켜져 있을 때의 index.html: 제목·설명 같은 head 메타는 그대로 두고,
 * 모든 스크립트(분석 포함)와 랜딩 본문을 걷어 낸 뒤 점검 안내 한 화면만 넣는다. 정적 페이지는 public/에서 그대로 나간다.
 */
function maintenancePage(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>\s*/g, '')
    .replace(/<noscript>[\s\S]*?<\/noscript>\s*/g, '')
    .replace(/<link rel="preload"[^>]*>\s*/g, '')
    .replace('</head>', () => `${MAINTENANCE_STYLE}\n  </head>`)
    .replace(
      MARK,
      () => `<main>
        <h1>최애를 풀어놨습니다</h1>
        <p>잠시 점검 중이에요. 곧 돌아올게요.</p>
        <nav><a href="/privacy.html">개인정보처리방침</a><a href="/faq.html">FAQ</a></nav>
      </main>`,
    );
}

/**
 * index.html의 `<!--LANDING_SHELL-->` 자리에 랜딩 전체(src/App.tsx)를 미리 그려 넣는다(빌드 때 한 번).
 *
 * - 자바스크립트가 내려와 실행되기 전에도 앱 이름·소개·버튼·모든 카테고리 글자가 HTML에 있다(첫 화면이 빨리 뜨고, 검색엔진·AdSense 검토가 글자를 바로 읽는다).
 * - 실제 화면은 `hydrateRoot`로 이 HTML에 그대로 붙는다(DOM을 새로 만들지 않아서 첫 화면 요소가 바뀌지 않는다).
 * - 컴포넌트를 그대로 그리므로 화면과 어긋날 일이 없다. 개발 서버에서는 그 서버로, 빌드에서는 잠깐 띄운 서버로 불러온다.
 */
export function landingShellPlugin(): Plugin {
  let root = process.cwd();
  let define: Record<string, unknown> = {};
  return {
    name: 'choeae-landing-shell',
    configResolved(config) {
      root = config.root;
      define = config.define ?? {};
    },
    transformIndexHtml: {
      order: 'pre',
      async handler(html, ctx) {
        if (!html.includes(MARK)) return html;
        if (SITE_MAINTENANCE) return maintenancePage(html);
        let server: ViteDevServer | undefined = ctx.server;
        const own = !server;
        if (!server) {
          server = await createServer({
            root,
            configFile: false,
            appType: 'custom',
            logLevel: 'silent',
            define,
            server: {middlewareMode: true, hmr: false, watch: null},
            optimizeDeps: {noDiscovery: true, include: []},
          });
        }
        try {
          const app = await server.ssrLoadModule('/src/App.tsx');
          const markup = renderToString(createElement(app.default));
          return html.replace(MARK, () => markup);
        } finally {
          if (own) await server.close();
        }
      },
    },
  };
}
