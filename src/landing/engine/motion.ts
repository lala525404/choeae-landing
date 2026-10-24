/** 창 안 등장 모션: 카드뉴스식(cards: "처음이신가요?"·"기능")과 쌓이는 항목(stack: 업데이트 내역·FAQ)
 *
 * 문구는 처음부터 DOM에 있고(글자마다 .tyc), 이 모듈은 클래스만 켜고 끈다. 드러내는 건 landing.css의 CSS 애니메이션이다.
 * 클래스가 없는 상태가 곧 최종 레이아웃이라서, 이 모듈이 늦게 오거나 실패해도 내용은 처음부터 다 보인다.
 * 한 탭에서 카테고리마다 한 번만 자동 재생한다(다시 보기 버튼은 언제든). 순서는 setTimeout 체인이고 rAF 반복은 쓰지 않는다. */
import {$, $$, type Ctx} from './core';

/** 시간은 모두 ms. 쿼리 ?slow=4 는 ctx.ms와 CSS(--cn-k) 양쪽에서 같은 배율로 느려진다 */
const CARDS = {
  /** 카드 한 장의 타이핑 목표 시간. 글자당 지연은 이 값을 글자 수로 나눠 [minChar, maxChar]로 자른다 */
  typeMs: 1200,
  minChar: 18,
  maxChar: 70,
  /** 확대·축소 이동 시간(CSS --cn-zoom과 같아야 한다) */
  zoomMs: 350,
  /** 확대가 시작되고 타이핑이 시작되기까지 */
  typeLead: 150,
  /** 타이핑이 끝난 뒤 유지 */
  holdMs: 400,
  /** 첫 카드 전 배경 막이 깔리는 시간, 마지막 카드 뒤 막이 걷히는 시간(CSS --cn-veil과 같아야 한다) */
  veilMs: 250,
  scale: 1.35,
};
const STACK = {stepMs: 105, popMs: 420};
/** 기능 격자: 80ms 간격, 한 장 0.4초(CSS rise-in과 같아야 한다). 8장이면 (7×80+400)ms = 960ms로 1초 안에 끝난다 */
const RISE = {stepMs: 80, popMs: 400};

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
  const skipBtn = $<HTMLButtonElement>('#cn-skip');
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
    const veil = kind === 'cards' && !ctx.mobile() ? veilOf(sec) : null;
    const small = ctx.mobile();
    let over = false;

    const finish = () => {
      if (over) return;
      over = true;
      ids.forEach(clearTimeout);
      win.classList.remove('cn-on', 'cn-lift', 'cn-sm', 'st-on', 'rise-on');
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
        }, ctx.ms(CARDS.veilMs));
      }
      skipBtn.hidden = true;
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
    if (kind === 'rise') {
      const n = $$('[data-rise]', win).length;
      win.classList.add('rise-on');
      later(finish, (n - 1) * RISE.stepMs + RISE.popMs + 40);
      return;
    }

    skipBtn.hidden = false;
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
        later(finish, veil ? CARDS.veilMs : 0);
        return;
      }
      const c = cards[i];
      const n = Math.max(1, [...(c.querySelector('p')?.textContent ?? '')].length);
      const per = Math.min(CARDS.maxChar, Math.max(CARDS.minChar, CARDS.typeMs / n));
      c.style.setProperty('--cd', per + 'ms');
      if (!small) {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--cn-x', Math.round(innerWidth / 2 - (r.left + r.width / 2)) + 'px');
        c.style.setProperty('--cn-y', Math.round(innerHeight / 2 - (r.top + r.height / 2)) + 'px');
      }
      c.classList.add('cn-up');
      const typeEnd = CARDS.typeLead + n * per;
      later(() => c.classList.add('cn-typing'), CARDS.typeLead);
      later(() => {
        c.classList.remove('cn-up', 'cn-typing'); // 축소되며 제자리로, 화살표가 켜진다
        c.classList.add('cn-done');
      }, typeEnd + CARDS.holdMs);
      later(() => step(i + 1), typeEnd + CARDS.holdMs + (small ? 80 : CARDS.zoomMs));
    };
    later(() => step(0), veil ? CARDS.veilMs : 0);
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
    {threshold: [0, 0.3, 0.6, 0.8, 1]},
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
