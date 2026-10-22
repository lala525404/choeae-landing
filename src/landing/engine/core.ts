/** 엔진 공통: 설정값, 선택자 도우미, 저장소, 모듈끼리 나눠 쓰는 상태(Ctx) */

export const E = 'cubic-bezier(.23,1,.32,1)';

/** 설정값(시간은 모두 ms). 쿼리 ?slow=4 는 캡처·검증용으로 모든 연출을 4배 느리게 한다 */
export const CONFIG = {
  /** 인트로 → 메인 줌인 전체 길이 */
  zoomMs: 1250,
  /** 인트로에서 건너뛰기·Esc·"바로 다운받기": 같은 줌인을 빠르게 재생(밝기 변화율이 4/초를 넘지 않게 700ms가 아니라 900ms) */
  zoomFastMs: 900,
  /** 같은 방문에서 카테고리를 다시 볼 때: 'full'(첫 진입과 동일, 결정) | 'short' | 'none'. 연출 도중 건너뛰는 안전장치는 항상 유지 */
  revisit: 'full' as 'full' | 'short' | 'none',
  /** 인트로 시간표 */
  intro: {heart: 500, nameAt: 200, nameMs: 500, bootAt: 400, phraseAt: 900, phraseMs: 1600, buttonsGap: 500, buttonsMs: 300},
};

export const CAT = ['start', 'features', 'download', 'updates', 'faq', 'privacy'] as const;

export const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T => root.querySelector(sel) as T;
export const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T[] => [...root.querySelectorAll<T>(sel)];

export const store = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* 저장이 막혀 있어도 이번 방문에서는 동작한다 */
    }
  },
};

/** 요소에 붙여 두는 캐시(값이 바뀔 때만 DOM에 쓰기 위한 표식) */
export type Cached = HTMLElement & {_transform?: string | null; _v?: string | null; _opacity?: string | null};

export interface State {
  /** 인트로 문구가 읽히는 동안의 "조용한 모드": 눈 추적·스파클·펫·버튼 없음 */
  introQuiet: boolean;
  zooming: boolean;
  lookEl: HTMLElement | null;
  avoid: boolean;
  no3d: boolean;
  petOff: boolean;
  keysOff: boolean;
  moved: boolean;
  clicks: number;
  /** 직접 링크로 들어온 카테고리: 짧은 진입 연출 */
  directId: string | null;
}

/** 모듈끼리 부르는 함수. 각 모듈이 자기 것을 채운다 */
export interface Fns {
  place(first?: boolean): void;
  activate(id: string, force?: boolean): void;
  goTo(id: string): void;
  resetTransforms(): void;
  completeIntro(): void;
  enterIntroReady(): void;
  fastZoom(target?: string, nonum?: boolean): void;
  zoomEnter(opts?: {fast?: boolean; target?: string; nonum?: boolean}): void;
  returnToIntro(): void;
  finishEntrances(): void;
  beginNav(id: string, focus?: boolean): void;
  burstFrom(el: Element, n: number): void;
  resetWindows(): void;
}

export interface Ctx {
  root: HTMLElement;
  body: HTMLElement;
  signal: AbortSignal;
  q: URLSearchParams;
  rm: boolean;
  touch: boolean;
  ms(x: number): number;
  mobile(): boolean;
  /** 카테고리 창을 세로로 쌓는 폭(태블릿·모바일) */
  stacked(): boolean;
  st: State;
  fn: Fns;
  /** 정리할 때 한꺼번에 떼어지는 이벤트 리스너 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(target: EventTarget, type: string, handler: (e: any) => void, opts?: AddEventListenerOptions | boolean): void;
  /** 정리할 때 같이 멈출 타이머 */
  timeout(fn: () => void, ms: number): number;
  disposers: (() => void)[];
  /** 화면 중앙 기준 현재 보이는 화면 id (body[data-sec]) */
  slotOf(id: string): HTMLElement;
}

export function createCtx(signal: AbortSignal): Ctx {
  const q = new URLSearchParams(location.search);
  const slow = Number(q.get('slow')) || 1;
  const timers = new Set<number>();
  const ctx: Ctx = {
    root: document.documentElement,
    body: document.body,
    signal,
    q,
    rm: matchMedia('(prefers-reduced-motion: reduce)').matches,
    touch: matchMedia('(hover: none), (pointer: coarse)').matches,
    ms: (x) => x * slow,
    mobile: () => innerWidth <= 720,
    stacked: () => innerWidth <= 1100,
    st: {introQuiet: false, zooming: false, lookEl: null, avoid: false, no3d: false, petOff: false, keysOff: false, moved: false, clicks: 0, directId: null},
    fn: {
      place() {},
      activate() {},
      goTo() {},
      resetTransforms() {},
      completeIntro() {},
      enterIntroReady() {},
      fastZoom() {},
      zoomEnter() {},
      returnToIntro() {},
      finishEntrances() {},
      beginNav() {},
      burstFrom() {},
      resetWindows() {},
    },
    on(target, type, handler, opts) {
      const o = typeof opts === 'boolean' ? {capture: opts} : (opts ?? {});
      target.addEventListener(type, handler as EventListener, {...o, signal});
    },
    timeout(fn, ms) {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
      return id;
    },
    disposers: [],
    slotOf: (id) => $('[data-slot]', $('#' + id)),
  };
  ctx.disposers.push(() => timers.forEach((t) => clearTimeout(t)));
  return ctx;
}

/* ── 문자 스크램블(끝은 항상 원문). 매 프레임이 아니라 일정 간격마다 글자를 바꿔서 정리되는 과정이 보인다 ── */
type Scrambling = HTMLElement & {_tok?: object | null};

export function scrambleTo(el: HTMLElement, final: string, dur: number, tick = 70) {
  const pool = '가나다라마바사아자차카타파하·+*';
  const node = el as Scrambling;
  const tok = (node._tok = {});
  const t0 = performance.now();
  let lastT = 0;
  let cur = '';
  const step = (n: number) => {
    if (node._tok !== tok) return;
    const k = Math.min(1, (n - t0) / dur);
    if (k >= 1) {
      el.textContent = final;
      return;
    }
    if (n - lastT >= tick || !cur) {
      lastT = n;
      cur = [...final].map((c, i) => (c === ' ' || i < k * final.length ? c : pool[(Math.random() * pool.length) | 0])).join('');
      el.textContent = cur;
    }
    requestAnimationFrame(step);
  };
  step(t0);
}

export function stopScramble(el: HTMLElement, final: string) {
  (el as Scrambling)._tok = null;
  el.textContent = final;
}

export const rnd = (a: number, b: number) => a + Math.random() * (b - a);

export const instantScroll = (el: Element) => el.scrollIntoView({behavior: 'instant' as ScrollBehavior, block: 'start'});
