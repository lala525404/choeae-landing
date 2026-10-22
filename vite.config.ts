import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'path';
import {defineConfig} from 'vite';
import {landingShellPlugin} from './vite-plugins/landing-shell';
import {siteUrlPlugin} from './vite-plugins/site-url';

/** 개인정보처리방침 요약에 쓰는 시행일은 public/privacy.html의 "시행일:" 한 곳에서 가져온다(요약과 전문이 어긋나지 않게). */
function privacyEffectiveDate(): string {
  const html = fs.readFileSync(path.resolve(__dirname, 'public/privacy.html'), 'utf-8');
  const match = html.match(/시행일:\s*([^<]+)</);
  if (!match) throw new Error('public/privacy.html에서 "시행일:"을 찾지 못했어요.');
  return match[1].trim();
}

export default defineConfig(() => {
  return {
    plugins: [react(), landingShellPlugin(), siteUrlPlugin()],
    define: {
      __PRIVACY_DATE__: JSON.stringify(privacyEffectiveDate()),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
