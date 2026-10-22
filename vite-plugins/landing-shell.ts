import {createElement} from 'react';
import {renderToString} from 'react-dom/server';
import {createServer, type Plugin, type ViteDevServer} from 'vite';

const MARK = '<!--LANDING_SHELL-->';

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
