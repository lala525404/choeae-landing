import {createCtx} from './core';
import {initDemo, initMap, initSys} from './extras';
import {initIntro} from './intro';
import {initMotion} from './motion';
import {initNav} from './nav';
import {initPointer} from './pointer';
import {initWindows} from './windows';

/**
 * 랜딩의 움직임을 DOM에 입힌다(마크업은 React가 이미 그려 둔 상태). 돌려주는 함수를 부르면 이벤트·타이머·관찰자를 모두 정리한다.
 * wheel 이벤트는 쓰지 않는다 — 스크롤은 브라우저 기본 동작 그대로다.
 */
export function initLanding(): () => void {
  const abort = new AbortController();
  const ctx = createCtx(abort.signal);
  initPointer(ctx);
  initWindows(ctx);
  initDemo(ctx);
  initMap(ctx);
  initSys(ctx);
  const intro = initIntro(ctx);
  const nav = initNav(ctx);
  initMotion(ctx);
  nav.boot(intro);
  return () => {
    abort.abort();
    ctx.disposers.forEach((dispose) => dispose());
  };
}
