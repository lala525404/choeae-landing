import {DOWNLOADS, PRODUCT_NAME} from '../constants';
import {usePlatform} from '../hooks/usePlatform';
import type {Platform} from '../types';

export const ONE_LINER = '좋아하는 사진이 모니터 위를 돌아다니는 데스크톱 펫 앱';

/** 인트로·히어로의 "바로 다운받기" 아래 작은 글씨 */
export function ctaSub(platform: Platform) {
  const {windows, mac} = DOWNLOADS;
  if (platform === 'mac') return `macOS v${mac.version} · 무료`;
  if (platform === 'mobile') return '컴퓨터에서 받아 주세요 · 무료';
  return `Windows v${windows.version} · 무료`;
}

/** 0. 인트로(첫 화면): 항상 다크. 모든 텍스트는 처음부터 DOM에 있고, 연출은 엔진이 opacity/transform으로만 입힌다 */
export function Intro() {
  const platform = usePlatform();
  return (
    <section id="intro" className="screen" aria-labelledby="h-intro">
      <div id="fx" aria-hidden="true" />
      <span id="walker" aria-hidden="true" />
      <div className="islot" data-slot />
      <div className="ic" id="ic">
        <h1 id="h-intro">{PRODUCT_NAME}</h1>
        <p id="bootmsg" data-text={ONE_LINER}>
          {ONE_LINER}
        </p>
        <div className="bar" id="bootbar" aria-hidden="true">
          <i id="bootfill" />
        </div>
        <div className="cta" id="entry" role="group" aria-label="시작하기">
          <a className="btn" id="go-first" href="#hero" data-look data-fx>
            처음이신가요?
          </a>
          <a className="btn main" id="go-dl" href="#download" data-instant data-look data-avoid data-fx>
            <span>바로 다운받기</span>
            <small>{ctaSub(platform)}</small>
          </a>
        </div>
        <p className="trust" id="itrust">
          <span>Windows · macOS(Apple Silicon)</span>
          <span>무료 · 앱 안 광고 없음</span>
        </p>
      </div>
    </section>
  );
}

