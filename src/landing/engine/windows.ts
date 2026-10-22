/** 카테고리 창: 드래그(translate)·접기·닫기/다시 열기·앞으로·초기화, 탭, 기능 카드 순환 재생 */
import {detectPlatform} from '../../hooks/usePlatform';
import {$, $$, E, type Ctx} from './core';

type Win = HTMLElement & {_dx?: number; _dy?: number};

export function initWindows(ctx: Ctx) {
  const {rm, body} = ctx;
  const wins = $$<Win>('.win');
  let z = 50;
  const reopenOf = (w: Win) => $<HTMLButtonElement>(`.reopen[data-for="${w.id}"]`);
  const front = (w: Win) => {
    w.style.zIndex = String(++z);
  };

  function fold(w: Win, to?: boolean) {
    const c = to ?? !w.hasAttribute('data-collapsed');
    w.toggleAttribute('data-collapsed', c);
    const b = $('[data-act=fold]', w);
    b.setAttribute('aria-expanded', String(!c));
    b.textContent = c ? '+' : '−';
    b.setAttribute('aria-label', c ? '펼치기' : '접기');
  }
  const move = (w: Win, dx: number, dy: number) => {
    w._dx = dx;
    w._dy = dy;
    w.style.setProperty('--dx', dx + 'px');
    w.style.setProperty('--dy', dy + 'px');
  };
  /** 제목 줄이 화면 밖으로 사라지지 않게: 가로는 48px만 남아도 되고, 세로는 화면 안에 */
  function clamp(w: Win) {
    if (ctx.stacked()) return;
    const sr = (w.closest('.screen') as HTMLElement).getBoundingClientRect();
    const r = w.getBoundingClientRect();
    const m = 48;
    let dx = w._dx ?? 0;
    let dy = w._dy ?? 0;
    const l = r.left - sr.left;
    const t = r.top - sr.top;
    if (l < m - r.width) dx += m - r.width - l;
    else if (l > sr.width - m) dx -= l - (sr.width - m);
    if (t < 0) dy -= t;
    else if (t > sr.height - 40) dy -= t - (sr.height - 40);
    move(w, dx, dy);
  }
  const closeWin = (w: Win) => {
    w.hidden = true;
    const rb = reopenOf(w);
    rb.hidden = false;
    rb.focus();
  };

  wins.forEach((w) => {
    const rb = reopenOf(w);
    ctx.on(rb, 'click', () => {
      w.hidden = false;
      rb.hidden = true;
      fold(w, false);
      front(w);
      if (!rm) w.animate([{opacity: 0, transform: 'translateY(12px)'}, {opacity: 1, transform: 'none'}], {duration: 260, easing: E});
      $('.ib', w).focus({preventScroll: true});
    });
    ctx.on(w, 'pointerdown', () => front(w));
    ctx.on($('[data-act=fold]', w), 'click', () => fold(w));
    ctx.on($('[data-act=close]', w), 'click', () => closeWin(w));
    ctx.on(w, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !(e.target as HTMLElement).closest('input,textarea')) closeWin(w);
    });
    const tb = $('.tb', w);
    let d: {x: number; y: number; dx: number; dy: number} | null = null;
    ctx.on(tb, 'pointerdown', (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('.ib') || ctx.stacked() || e.button > 0) return;
      d = {x: e.clientX, y: e.clientY, dx: w._dx ?? 0, dy: w._dy ?? 0};
      w.classList.add('dragging');
      tb.setPointerCapture(e.pointerId);
    });
    ctx.on(tb, 'pointermove', (e: PointerEvent) => {
      if (d) move(w, d.dx + e.clientX - d.x, d.dy + e.clientY - d.y);
    });
    const end = () => {
      if (!d) return;
      d = null;
      w.classList.remove('dragging');
      clamp(w);
    };
    ctx.on(tb, 'pointerup', end);
    ctx.on(tb, 'pointercancel', end);
    ctx.on(tb, 'keydown', (e: KeyboardEvent) => {
      if (!e.altKey || !e.key.startsWith('Arrow') || ctx.stacked()) return;
      e.preventDefault();
      const s = 24;
      const mx: Record<string, number> = {ArrowLeft: -s, ArrowRight: s};
      const my: Record<string, number> = {ArrowUp: -s, ArrowDown: s};
      move(w, (w._dx ?? 0) + (mx[e.key] ?? 0), (w._dy ?? 0) + (my[e.key] ?? 0));
      clamp(w);
    });
  });
  ctx.on(window, 'resize', () => {
    wins.forEach(clamp);
    ctx.fn.place();
  });
  ctx.fn.resetWindows = () => {
    wins.forEach((w) => {
      move(w, 0, 0);
      w.hidden = false;
      reopenOf(w).hidden = true;
      fold(w, w.hasAttribute('data-start-collapsed'));
      front(w);
    });
  };
  ctx.on($('#tReset'), 'click', () => ctx.fn.resetWindows());

  /* 탭: 방향키로 이동, 선택한 탭의 패널만 보인다(나머지는 hidden이지만 DOM에는 텍스트가 그대로 있다) */
  $$('[role=tablist]').forEach((list) => {
    const tl = $$<HTMLElement>('[role=tab]', list);
    tl.forEach((t, i) => {
      const pick = () =>
        tl.forEach((x) => {
          const on = x === t;
          x.setAttribute('aria-selected', String(on));
          x.tabIndex = on ? 0 : -1;
          const pn = document.getElementById(x.getAttribute('aria-controls') ?? '');
          if (pn) pn.hidden = !on;
        });
      ctx.on(t, 'click', pick);
      ctx.on(t, 'keydown', (e: KeyboardEvent) => {
        const j = ({ArrowDown: i + 1, ArrowUp: i - 1, ArrowRight: i + 1, ArrowLeft: i - 1} as Record<string, number>)[e.key];
        if (j != null) {
          e.preventDefault();
          const n = tl[(j + tl.length) % tl.length];
          n.focus();
          n.click();
        }
      });
    });
  });
  if (detectPlatform() === 'mac') $('#ins-t1').click(); // 맥으로 접속하면 macOS 설치 방법이 먼저 열린다

  /* ── 기능 카드 샘플: 8개를 동시에 재생하면 느린 PC에서 프레임이 떨어져서, 3개만 순환 재생(3초마다 한 칸씩)하고 나머지는 정지 장면.
        호버·포커스한 카드는 즉시 재생. 움직임 줄이기에서는 모두 정지 ── */
  const fcs = $$('#w-cards .fc');
  let fcStart = 0;
  let fcHover: HTMLElement | null = null;
  const fcApply = () =>
    fcs.forEach((c, i) => {
      const live = rm ? false : fcHover === c || [0, 1, 2].some((k) => (fcStart + k) % fcs.length === i);
      c.classList.toggle('hold', !live);
    });
  fcApply();
  if (!rm) {
    const timer = window.setInterval(() => {
      if (body.dataset.sec === 'features' && !document.hidden && !document.querySelector('.cat.entering')) {
        fcStart = (fcStart + 1) % fcs.length;
        fcApply();
      }
    }, 3000);
    ctx.disposers.push(() => clearInterval(timer));
    fcs.forEach((c) => {
      const on = () => {
        fcHover = c;
        fcApply();
      };
      const off = () => {
        if (fcHover === c) {
          fcHover = null;
          fcApply();
        }
      };
      ctx.on(c, 'pointerenter', on);
      ctx.on(c, 'pointerleave', off);
      ctx.on(c, 'focus', on);
      ctx.on(c, 'blur', off);
    });
  }
}
