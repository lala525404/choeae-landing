/** 창 안 등장 모션: 카드뉴스식(cards: "처음이신가요?"·"기능")과 쌓이는 항목(stack: 업데이트 내역·FAQ)
 *
 * 문구는 처음부터 DOM에 있고(글자마다 .tyc), 이 모듈은 클래스만 켜고 끈다. 드러내는 건 landing.css의 CSS 애니메이션이다.
 * 클래스가 없는 상태가 곧 최종 레이아웃이라서, 이 모듈이 늦게 오거나 실패해도 내용은 처음부터 다 보인다.
 * 한 탭에서 카테고리마다 한 번만 자동 재생한다(다시 보기 버튼은 언제든). 순서는 setTimeout 체인이고 rAF 반복은 쓰지 않는다. */
import {$, $$, type Ctx} from './core';

/** 시간은 모두 ms. 쿼리 ?slow=4 는 ctx.ms와 CSS(--cn-k) 양쪽에서 같은 배율로 느려진다 */
interface CardsProfile {
  /** 확대(--cn-in)·축소(--cn-out) 이동 시간 */
  expandMs: number;
  shrinkMs: number;
  /** 카드 한 장의 타이핑 목표 시간. 글자당 지연은 이 값을 글자 수로 나눠 [minChar, maxChar]로 자른다 */
  typeMs: number;
  minChar: number;
  maxChar: number;
  /** 확대가 시작되고 타이핑이 시작되기까지 */
  typeLead: number;
  /** 타이핑이 끝난 뒤 유지(읽는 시간). 16자를 넘는 글자마다 holdPerCharMs를 더하되 holdMaxMs를 넘지 않는다 */
  holdMs: number;
  holdPerCharMs: number;
  holdMaxMs: number;
  /** 축소가 끝나기 이만큼 전에 다음 카드가 확대를 시작한다 */
  overlapMs: number;
  scale: number;
  /** 확대한 카드를 창 안쪽으로 보정할지(false면 화면 가운데로) */
  inWin: boolean;
  /** 좁은 화면(확대 없이 하이라이트 + 타이핑): 타이핑 시간, 시작 지연, 유지, 다음 카드까지 간격 */
  small: {typeMs: number; typeLead: number; holdMs: number; gapMs: number};
}
const PROFILES: Record<'steps' | 'grid', CardsProfile> = {
  /** "처음이신가요?" 3장: 카드당 약 2.1초 */
  steps: {expandMs: 350, shrinkMs: 350, typeMs: 1200, minChar: 18, maxChar: 70, typeLead: 150, holdMs: 400, holdPerCharMs: 0, holdMaxMs: 400, overlapMs: 0, scale: 1.35, inWin: false, small: {typeMs: 1200, typeLead: 150, holdMs: 400, gapMs: 80}},
  /** "기능" 8장: 읽을 수 있게 카드당 약 2초(전체 약 16초). 속도는 여기 한 곳에서 조절한다. 좁은 화면은 카드당 약 1.45초 */
  grid: {expandMs: 300, shrinkMs: 250, typeMs: 900, minChar: 6, maxChar: 45, typeLead: 300, holdMs: 700, holdPerCharMs: 10, holdMaxMs: 1100, overlapMs: 100, scale: 1.25, inWin: true, small: {typeMs: 800, typeLead: 0, holdMs: 500, gapMs: 150}},
};
/** 첫 카드 전 배경 막이 깔리는 시간, 마지막 카드 뒤 막이 걷히는 시간(CSS --cn-veil과 같아야 한다) */
const VEIL_MS = 250;
/** 확대된 카드와 창 가장자리 사이 여백(px) */
const EDGE = 8;
const STACK = {stepMs: 105, popMs: 420};

const SEEN = 'choeae-motion:';
const memSeen = new Set<string>();
const seen = {
  has(id: string) {
    if (memSeen.has(id)) return true;
    try {
      return sessionStorage.getItem(SEEN + id) === '1';
    } catch {
      return false; // 저장소를 못 읽으면 메모리 변수만 본다
    }
  },
  add(id: string) {
    memSeen.add(id);
    try {
      sessionStorage.setItem(SEEN + id, '1');
    } catch {
      /* 접근이 막혀 있어도 이번 탭의 메모리 변수로 충분하다 */
    }
  },
};

interface Play {
  sec: string;
  finish(): void;
}

export function initMotion(ctx: Ctx) {
  const {rm, root} = ctx;
  if (rm) return; // 움직임 줄이기: 모든 등장 모션을 생략하고 최종 상태 그대로(다시 보기 버튼도 숨겨 둔 채)
  root.style.setProperty('--cn-k', String(ctx.ms(1)));

  const wins = $$('.win[data-motion]');
  const replays = $$<HTMLButtonElement>('[data-act=replay]');
  const ctl = $('#cn-ctl'); // 건너뛰기 버튼 + 몇 번째 카드인지 보여 주는 진행 표시
  const skipBtn = $<HTMLButtonElement>('#cn-skip');
  const count = $('#cn-count');
  let cur: Play | null = null;
  let lastInput = -1e9;

  /** 배경 막: 카테고리 화면 안에 둔다(화면은 content-visibility로 그려지는 범위가 갇혀 있어서 바깥에 두면 창보다 위로 올라온다) */
  const veilOf = (sec: HTMLElement) => {
    let v = $('.cn-veil', sec);
    if (!v) {
      v = document.createElement('div');
      v.className = 'cn-veil';
      v.setAttribute('aria-hidden', 'true');
      sec.append(v);
    }
    return v;
  };

  function start(win: HTMLElement) {
    if (cur || win.hidden || win.hasAttribute('data-collapsed')) return;
    const sec = win.closest<HTMLElement>('.cat')!;
    const kind = win.dataset.motion;
    const ids: number[] = [];
    const later = (fn: () => void, ms: number) => ids.push(ctx.timeout(fn, ctx.ms(ms)));
    const cards = $$('[data-cn-card]', win);
    const P = kind === 'grid' ? PROFILES.grid : PROFILES.steps;
    const veil = (kind === 'cards' || kind === 'grid') && !ctx.mobile() ? veilOf(sec) : null;
    const small = ctx.mobile();
    let over = false;

    const finish = () => {
      if (over) return;
      over = true;
      ids.forEach(clearTimeout);
      win.classList.remove('cn-on', 'cn-lift', 'cn-sm', 'st-on');
      win.style.removeProperty('--cn-in');
      win.style.removeProperty('--cn-out');
      win.style.removeProperty('--cn-s');
      cards.forEach((c) => {
        c.classList.remove('cn-up', 'cn-typing', 'cn-done');
        c.style.removeProperty('--cn-x');
        c.style.removeProperty('--cn-y');
        c.style.removeProperty('--cd');
      });
      if (veil) {
        veil.classList.remove('on');
        ctx.timeout(() => {
          if (!cur) veil.hidden = true;
        }, ctx.ms(VEIL_MS));
      }
      ctl.hidden = true;
      replays.forEach((b) => (b.disabled = false));
      cur = null;
    };
    cur = {sec: sec.id, finish};
    replays.forEach((b) => (b.disabled = true)); // 재생 중에는 다시 보기를 잠가 둔다

    if (kind === 'stack') {
      const n = Math.min($$('[data-st]', win).length, 8);
      win.classList.add('st-on');
      later(finish, n * STACK.stepMs + STACK.popMs + 60);
      return;
    }

    count.textContent = `1 / ${cards.length}`;
    ctl.hidden = false;
    win.style.setProperty('--cn-in', P.expandMs + 'ms');
    win.style.setProperty('--cn-out', P.shrinkMs + 'ms');
    win.style.setProperty('--cn-s', String(P.scale));
    win.classList.add('cn-on', 'cn-lift');
    if (small) win.classList.add('cn-sm'); // 좁은 화면: 확대 없이 해당 카드 하이라이트 + 타이핑
    if (veil) {
      veil.hidden = false;
      void veil.offsetWidth; // 숨김 해제 직후 transition이 시작되게 한 번만 레이아웃을 확정
      veil.classList.add('on');
    }
    const step = (i: number) => {
      if (i >= cards.length) {
        later(() => veil?.classList.remove('on'), 0);
        later(finish, veil ? VEIL_MS : 0);
        return;
      }
      const c = cards[i];
      count.textContent = `${i + 1} / ${cards.length}`;
      const text = c.querySelector('p')?.textContent ?? '';
      const chars = [...text].length;
      const lead = small ? P.small.typeLead : P.typeLead;
      const per = Math.min(P.maxChar, Math.max(P.minChar, (small ? P.small.typeMs : P.typeMs) / Math.max(1, chars)));
      c.style.setProperty('--cd', per + 'ms');
      if (!small) {
        const r = c.getBoundingClientRect();
        let cx = innerWidth / 2;
        let cy = innerHeight / 2;
        if (P.inWin) {
          // 창 안쪽(화면과 겹치는 부분)의 가운데로 가되, 확대된 카드가 창 가장자리 밖으로(옆 패널 위로) 나가지 않게 가운데를 보정한다
          const w = win.getBoundingClientRect();
          const b = {l: Math.max(w.left, 0) + EDGE, r: Math.min(w.right, innerWidth) - EDGE, t: Math.max(w.top + 42, 0) + EDGE, b: Math.min(w.bottom, innerHeight) - EDGE};
          const hw = (r.width * P.scale) / 2;
          const hh = (r.height * P.scale) / 2;
          cx = b.l + hw > b.r - hw ? (b.l + b.r) / 2 : Math.min(Math.max((b.l + b.r) / 2, b.l + hw), b.r - hw);
          cy = b.t + hh > b.b - hh ? (b.t + b.b) / 2 : Math.min(Math.max((b.t + b.b) / 2, b.t + hh), b.b - hh);
        }
        c.style.setProperty('--cn-x', Math.round(cx - (r.left + r.width / 2)) + 'px');
        c.style.setProperty('--cn-y', Math.round(cy - (r.top + r.height / 2)) + 'px');
      }
      c.classList.add('cn-up');
      // 설명 문구가 없는 카드는 타이핑 없이 확대만(확대 → 바로 축소)
      const typeEnd = chars ? lead + chars * per : small ? 0 : P.expandMs;
      const hold = !chars ? 0 : small ? P.small.holdMs : Math.min(P.holdMaxMs, P.holdMs + P.holdPerCharMs * Math.max(0, chars - 16));
      if (chars) later(() => c.classList.add('cn-typing'), lead);
      later(() => {
        c.classList.remove('cn-up', 'cn-typing'); // 축소되며 제자리로, 화살표가 켜진다
        c.classList.add('cn-done');
      }, typeEnd + hold);
      later(() => step(i + 1), typeEnd + hold + (small ? P.small.gapMs : P.shrinkMs - P.overlapMs));
    };
    later(() => step(0), veil ? VEIL_MS : 0);
  }

  /* ── 건너뛰기: 재생 중 아무 곳이나 클릭하거나 Esc·Enter·Space ── */
  ctx.on(
    window,
    'pointerdown',
    () => {
      lastInput = performance.now();
      cur?.finish();
    },
    true,
  );
  ctx.on(
    window,
    'keydown',
    (e: KeyboardEvent) => {
      if (!['Escape', 'Enter', ' '].includes(e.key)) return;
      lastInput = performance.now();
      if (!cur) return;
      e.preventDefault();
      if (e.key === 'Escape') e.stopPropagation(); // 창 안에 포커스가 있어도 Esc가 창을 닫아 버리지 않게
      cur.finish();
    },
    true,
  );
  ctx.on(skipBtn, 'click', () => cur?.finish());

  /* 다른 동작과의 충돌: 접기·닫기·레이아웃 초기화(L)·화면 이탈이면 즉시 중단 */
  wins.forEach((w) => {
    ctx.on($('[data-act=close]', w), 'click', () => cur?.finish());
    ctx.on($('[data-act=fold]', w), 'click', () => cur?.finish());
  });
  const resetWindows = ctx.fn.resetWindows;
  ctx.fn.resetWindows = () => {
    cur?.finish();
    resetWindows();
  };

  /* ── 다시 보기 ── */
  replays.forEach((b) => {
    b.hidden = false;
    ctx.on(b, 'click', () => {
      const w = b.closest<HTMLElement>('.win');
      if (w) start(w);
    });
  });

  /* ── 자동 재생: 카테고리가 60% 이상 보이고(긴 화면은 화면 높이의 60%) 진입 연출이 끝났을 때 한 번 ── */
  const visible = new Map<string, boolean>();
  /** 진입 연출(nav.ts)이 같은 관찰 알림에서 막 시작하는 경우가 있어서, 한 박자 뒤에 "연출 중인가"를 본다 */
  const tryAuto = (id: string) => {
    ctx.timeout(() => autoPlay(id), 60);
  };
  const autoPlay = (id: string) => {
    const sec = document.getElementById(id)!;
    if (cur || seen.has(id) || sec.classList.contains('entering') || !visible.get(id)) return;
    seen.add(id);
    if (performance.now() - lastInput < 120) return; // 진입 연출을 클릭·키로 건너뛴 사람에게 곧바로 또 연출을 보이지 않는다
    const w = $$<HTMLElement>('.win[data-motion]', sec).find((x) => !x.hidden);
    if (w) start(w);
  };
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        const id = e.target.id;
        const ok = e.isIntersecting && (e.intersectionRatio >= 0.6 || e.intersectionRect.height >= innerHeight * 0.6);
        visible.set(id, ok);
        if (ok) tryAuto(id);
        else if (!e.isIntersecting && cur?.sec === id) cur.finish();
      }),
    /* 화면보다 긴 카테고리(좁은 화면의 업데이트 내역·FAQ)는 도착했을 때 보이는 비율이 0.6에 못 미칠 수 있어서, 0.05 간격으로 촘촘하게 둬야 "높이 60%" 판정이 다시 불린다 */
    {threshold: Array.from({length: 21}, (_, i) => i / 20)},
  );
  new Set(wins.map((w) => w.closest<HTMLElement>('.cat')!)).forEach((sec) => {
    io.observe(sec);
    ctx.on(sec, 'cat:ready', () => tryAuto(sec.id));
  });
  ctx.disposers.push(() => {
    io.disconnect();
    cur?.finish();
  });
}
