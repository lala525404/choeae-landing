/** 화면 활성(IntersectionObserver) · 이동(앵커·히스토리) · 카테고리 진입 연출
 *
 * ══════════ 카테고리 진입 연출 ══════════
 * 타이틀(진행 표시 포함)이 화면 중앙에서 먼저 나타남 → 제자리로 이동 → 창이 하나씩 켜짐(제목 표시줄 먼저, 이어서 본문).
 * 같은 방문에서 다시 들어와도 첫 진입과 같게(full) 재생한다(CONFIG.revisit). 텍스트는 처음부터 DOM에 있고 숨기지 않는다.
 * 시작 상태는 WAAPI의 fill:'backwards'(opacity/transform)로만 만들어서 JS가 실패하거나 느려도 내용이 읽힌다.
 * 사용자가 스크롤·링크·키보드로 움직이면 즉시 마지막 상태로 건너뛴다(안전장치). wheel 이벤트는 가로채지 않는다. */
import {CAT, CONFIG, E, $, $$, instantScroll, scrambleTo, stopScramble, store, type Ctx} from './core';

type Mode = 'full' | 'short' | 'none' | 'direct' | 'rm';
interface Running {
  id: string;
  minTop: number;
  finish(): void;
}

export function initNav(ctx: Ctx) {
  const {rm, st, root, body} = ctx;
  const ms = ctx.ms;
  const played = new Set<string>();
  const running: Record<string, Running | undefined> = {};
  const navState = {target: null as string | null, focus: false, timer: 0};
  const inView = new Set<string>(); // 지금 화면에 보이는 중인 카테고리: 연출이 끝나도(건너뛰어도) 화면을 완전히 벗어났다 돌아오기 전에는 다시 시작하지 않는다
  const zone = () => root.dataset.zone;
  const finishAll = () => Object.values(running).forEach((s) => s?.finish());
  ctx.fn.finishEntrances = finishAll;

  function titleCenter(sec: HTMLElement, ht: HTMLElement, M: boolean) {
    const sr = sec.getBoundingClientRect();
    const tr = ht.getBoundingClientRect();
    const s = M ? 1.5 : 2.3;
    const w = tr.width;
    const h = tr.height;
    const cxL = sr.width / 2;
    const cyL = M ? Math.min(sr.height / 2, innerHeight * 0.42) : sr.height / 2;
    return `translate(${(cxL - (w * s) / 2 - (tr.left - sr.left)).toFixed(1)}px,${(cyL - (h * s) / 2 - (tr.top - sr.top)).toFixed(1)}px) scale(${s})`;
  }
  function buildSeq(sec: HTMLElement, mode: Mode) {
    const M = ctx.mobile();
    const ht = $('.hd-t', sec);
    const sub = $('.hd-sub', sec);
    const ws = $$('.win', sec).filter((w) => !w.hidden);
    const anims: Animation[] = [];
    const timers: number[] = [];
    const A = (el: HTMLElement | null, kf: Keyframe[], o: KeyframeAnimationOptions) => {
      if (!el) return;
      const a = el.animate(kf, {fill: 'backwards', easing: E, ...o});
      anims.push(a);
    };
    // 창 하나: 틀(+제목 표시줄)이 먼저, 본문이 140ms 뒤에
    const winOn = (w: HTMLElement, base: number, dur: number) => {
      A(w, rm ? [{opacity: 0}, {opacity: 1}] : [{opacity: 0, transform: 'translateY(12px) scale(.98)'}, {opacity: 1, transform: 'none'}], {delay: ms(base), duration: ms(dur)});
      A($('.tb', w), [{opacity: 0}, {opacity: 1}], {delay: ms(base), duration: ms(Math.round(dur * 0.62))});
      A($('.bodywrap', w), rm ? [{opacity: 0}, {opacity: 1}] : [{opacity: 0, transform: 'translateY(8px)'}, {opacity: 1, transform: 'none'}], {delay: ms(base + (M ? 100 : 140)), duration: ms(M ? 180 : 240)});
    };
    let total = 0;
    if (mode === 'rm') {
      A(ht, [{opacity: 0}, {opacity: 1}], {duration: ms(150)});
      A(sub, [{opacity: 0}, {opacity: 1}], {duration: ms(150)});
      ws.forEach((w) => A(w, [{opacity: 0}, {opacity: 1}], {duration: ms(150)}));
      total = 150;
    } else if (mode === 'short') {
      ws.forEach((w, i) => A(w, [{opacity: 0}, {opacity: 1}], {delay: ms(i * 60), duration: ms(200)}));
      total = 200 + 60 * Math.max(0, ws.length - 1);
    } else if (mode === 'direct') {
      A(ht, [{opacity: 0}, {opacity: 1}], {duration: ms(200)});
      A(sub, [{opacity: 0}, {opacity: 1}], {duration: ms(200)});
      ws.forEach((w, i) => winOn(w, 80 + i * 100, 200));
      total = 80 + 100 * Math.max(0, ws.length - 1) + 200 + 140 + 240;
    } else {
      // full
      const T0 = titleCenter(sec, ht, M);
      const D = M ? 700 : 1300;
      const o = M ? [0.14, 0.43, 0.6] : [0.115, 0.385, 0.615]; // 숨김 · 나타남 · 유지 끝 (비율)
      ht.style.transformOrigin = '0 0';
      A(
        ht,
        [
          {transform: T0, opacity: 0, offset: 0},
          {transform: T0, opacity: 0, offset: o[0], easing: E},
          {transform: T0, opacity: 1, offset: o[1]},
          {transform: T0, opacity: 1, offset: o[2], easing: 'cubic-bezier(.65,0,.25,1)'},
          {transform: 'none', opacity: 1, offset: 1},
        ],
        {duration: ms(D), easing: 'linear'},
      ); // 효과 전체 이징은 linear(시간축을 왜곡하지 않게), 구간 이징은 키프레임에
      const subAt = M ? 560 : 1100;
      const base = M ? 520 : 1000;
      const step = M ? 80 : 120;
      A(sub, [{opacity: 0}, {opacity: 1}], {delay: ms(subAt), duration: ms(M ? 160 : 220)});
      ws.forEach((w, i) => winOn(w, base + i * step, M ? 180 : 260));
      total = Math.max(D, base + step * Math.max(0, ws.length - 1) + (M ? 100 + 180 : 140 + 240));
      if (sec.id === 'features') timers.push(ctx.timeout(() => scrambleTo($('#scr'), $('#scr').dataset.text ?? '', ms(600), 40), ms(subAt)));
    }
    return {anims, timers, total};
  }
  function startEntrance(id: string) {
    if (running[id]) return;
    const sec = $('#' + id);
    const mode: Mode = rm ? 'rm' : st.directId === id ? 'direct' : played.has(id) ? CONFIG.revisit : 'full';
    if (st.directId === id) st.directId = null;
    if (mode === 'none') {
      played.add(id);
      return;
    }
    finishAll();
    sec.classList.add('entering');
    const b = buildSeq(sec, mode);
    const s: Running = {
      id,
      minTop: Math.abs(sec.getBoundingClientRect().top),
      finish() {
        if (running[id] !== s) return;
        b.timers.forEach(clearTimeout);
        b.anims.forEach((a) => {
          try {
            a.finish();
          } catch {
            /* 이미 끝났다 */
          }
        });
        if (id === 'features') stopScramble($('#scr'), $('#scr').dataset.text ?? '');
        sec.classList.remove('entering');
        delete running[id];
        played.add(id);
      },
    };
    running[id] = s;
    Promise.all(b.anims.map((a) => a.finished.catch(() => {}))).then(() => s.finish());
  }
  ctx.fn.beginNav = (id, focus = true) => {
    navState.target = id;
    navState.focus = focus;
    clearTimeout(navState.timer);
    navState.timer = ctx.timeout(() => {
      navState.target = null;
    }, 1800);
    finishAll();
  };
  function focusHead(sec: HTMLElement) {
    const h = $('h2', sec);
    if (h) {
      h.setAttribute('tabindex', '-1');
      h.focus({preventScroll: true});
    }
  }
  const entIO = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        const id = e.target.id;
        if (!(CAT as readonly string[]).includes(id)) return;
        const vis = e.isIntersecting && (e.intersectionRatio >= 0.15 || e.intersectionRect.height >= innerHeight * 0.15);
        if (vis) {
          if (inView.has(id)) return;
          inView.add(id);
          if (navState.target && navState.target !== id) return;
          const viaNav = navState.target === id;
          if (viaNav) {
            navState.target = null;
            if (navState.focus) focusHead(e.target as HTMLElement);
          }
          startEntrance(id);
        } else if (!e.isIntersecting) {
          inView.delete(id);
          running[id]?.finish();
        }
      }),
    {threshold: [0, 0.02, 0.05, 0.1, 0.15, 0.25, 0.5, 1]},
  );
  $$('.cat').forEach((s) => entIO.observe(s));
  /* 사용자 동작으로 연출을 건너뜀: 이동 키·클릭·계속 스크롤(wheel을 가로채지 않고 scroll 이벤트만 본다) */
  ctx.on(window, 'keydown', (e: KeyboardEvent) => {
    if (['Tab', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) finishAll();
  }, true);
  ctx.on(window, 'pointerdown', finishAll, true);
  ctx.on(
    window,
    'scroll',
    () => {
      // 화면 도착(가까워지는 중)은 허용하고, 화면에서 멀어지는 스크롤(계속 스크롤)이면 즉시 마지막 상태로
      for (const s of Object.values(running)) {
        if (!s) continue;
        const top = Math.abs(document.getElementById(s.id)!.getBoundingClientRect().top);
        if (top < s.minTop) s.minTop = top;
        else if (top - s.minTop > innerHeight * 0.15) s.finish();
      }
      if (ctx.mobile()) ctx.fn.place();
    },
    {passive: true},
  );

  /* ── 화면 활성(화면 중앙선). 브라우저 기본 스크롤을 그대로 쓴다 ── */
  const progl = $$<HTMLAnchorElement>('#progl a');
  ctx.fn.activate = (id, force) => {
    if (body.dataset.sec === id && !force) return;
    body.dataset.sec = id;
    root.dataset.zone = id === 'intro' ? 'intro' : 'main'; // 인트로 구역은 다크 + 스크롤 잠금, 그 밖은 메인 테마
    if (id !== 'download') delete root.dataset.nonum; // "바로 다운받기"로 들어왔을 때만 진행 번호를 숨긴다
    const i = (CAT as readonly string[]).indexOf(id);
    if (i >= 0) {
      body.dataset.cat = '1';
      $('#progn').textContent = `${String(i + 1).padStart(2, '0')} / ${String(CAT.length).padStart(2, '0')}`;
    } else delete body.dataset.cat;
    progl.forEach((a, j) => (j === i ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    $$('.cat').forEach((s) => s.classList.toggle('act', s.id === id)); // 보이는 화면의 샘플 애니메이션만 재생
    // 인트로가 덮고 있는 동안 아래 화면은 키보드·스크린리더가 닿지 않게 한다(눈에 안 보이는 링크로 Tab이 들어가지 않게)
    $$('main > section:not(#intro)').forEach((s) => {
      s.inert = id === 'intro';
    });
    ctx.fn.place();
    if (location.hash !== '#' + id && !(id === 'intro' && !location.hash)) history.replaceState(null, '', id === 'intro' ? location.pathname + location.search : '#' + id); // 스크롤로 바뀐 위치는 기록을 쌓지 않고 덮어쓴다
  };
  let lockUntil = 0;
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (!e.isIntersecting || performance.now() < lockUntil || st.zooming || zone() === 'intro') return; // 인트로 층이 덮은 동안에는 아래 화면이 중앙선에 있어도 활성으로 보지 않는다
        const id = e.target.id;
        if (navState.target && navState.target !== id) return;
        ctx.fn.activate(id);
      }),
    {rootMargin: '-50% 0px -50% 0px'},
  );
  $$('.screen').forEach((s) => io.observe(s));
  ctx.disposers.push(() => {
    entIO.disconnect();
    io.disconnect();
    Object.values(running).forEach((s) => s?.finish());
  });

  /* ── 이동: 줌인("처음이신가요?")·빠른 줌인(건너뛰기·"바로 다운받기")·인트로 복귀("처음으로")·나머지는 네이티브 앵커 ── */
  ctx.fn.goTo = (id) => {
    const t = document.getElementById(id)!;
    const fromIntro = zone() === 'intro';
    ctx.fn.beginNav(id);
    lockUntil = performance.now() + 300;
    root.dataset.zone = 'main';
    if (fromIntro) history.replaceState(null, '', '#' + id);
    else history.pushState(null, '', '#' + id); // 인트로에서 바로 가는 이동은 히스토리에 남기지 않는다
    instantScroll(t);
    ctx.fn.activate(id, true);
  };
  ctx.on(document, 'click', (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest?.<HTMLAnchorElement>('a[href^="#"]');
    if (!a || st.zooming) return;
    const id = a.getAttribute('href')!.slice(1);
    const t = document.getElementById(id);
    if (!t || !t.matches('.screen')) return;
    if (a.id === 'go-first') {
      e.preventDefault();
      ctx.fn.zoomEnter();
      return;
    }
    if (a.id === 'skipLink') {
      e.preventDefault();
      if (zone() === 'intro') ctx.fn.fastZoom();
      else ctx.fn.goTo('hero');
      return;
    }
    if (a.hasAttribute('data-instant')) {
      e.preventDefault();
      store.set('choeae-intro', '1');
      if (zone() === 'intro') ctx.fn.fastZoom(id, id === 'download'); // 인트로의 "바로 다운받기": 빠른 줌인 뒤 다운로드에 도착
      else {
        if (id === 'download') root.dataset.nonum = '';
        ctx.fn.goTo(id);
      }
      return;
    }
    if (id === 'intro') {
      e.preventDefault();
      ctx.fn.returnToIntro();
      return;
    }
    if (zone() === 'intro') {
      // 인트로에서 다른 화면으로 가는 링크는 줌인을 거친다
      e.preventDefault();
      ctx.fn.fastZoom(id);
      return;
    }
    ctx.fn.beginNav(id);
  });
  ctx.on(window, 'popstate', () => {
    const id = location.hash.slice(1) || 'hero';
    if (document.getElementById(id)) ctx.fn.beginNav(id);
  });
  ctx.on(window, 'hashchange', () => {
    const id = location.hash.slice(1);
    if (st.zooming) return;
    if (id === 'intro' && zone() === 'main') ctx.fn.returnToIntro();
    else if (zone() === 'intro' && id && id !== 'intro' && document.getElementById(id)?.matches('.screen')) {
      // 인트로 중 주소만 바뀐 경우(주소창에서 직접 이동): 줌인을 거쳐 그 화면으로
      history.replaceState(null, '', '#intro');
      ctx.fn.fastZoom(id);
    }
  });

  /* ══════════ 시작 ══════════
     - 인트로를 아직 안 봤고 직접 링크가 없으면: 인트로 시간표 재생(다크, 스크롤 잠금)
     - 직접 링크(#download 등) 또는 이미 본 방문자(영구 저장): 인트로·줌인 없이 해당 화면(없으면 히어로)으로 바로 */
  return {
    boot(intro: {start(): void; markReadyStatic(): void}) {
      const hashEl = location.hash ? document.getElementById(location.hash.slice(1)) : null;
      const direct = hashEl && hashEl.matches('.screen') ? hashEl : null;
      const seenIntro = store.get('choeae-intro') === '1';
      const forceIntro = ctx.q.get('intro') === '1';
      const forceSkip = ctx.q.get('intro') === '0';
      delete root.dataset.pre; // 인트로를 재생하지 않는 경우(재방문·직접 링크·?intro=0)에는 투명 상태를 바로 푼다. 재생하면 intro.start()가 푼다
      const needIntro = forceIntro || (!forceSkip && ((!direct && !seenIntro) || (direct?.id === 'intro' && !seenIntro)));
      if (needIntro) {
        ctx.fn.activate('intro');
        ctx.fn.place(true);
        intro.start();
      } else {
        intro.markReadyStatic();
        const target = direct ?? $('#hero');
        lockUntil = performance.now() + 600;
        if (target.id === 'intro') {
          ctx.fn.activate('intro', true);
          ctx.fn.place(true);
          ctx.fn.enterIntroReady();
        } else {
          instantScroll(target);
          if (direct && (CAT as readonly string[]).includes(direct.id)) st.directId = direct.id;
          ctx.fn.activate(target.id, true);
          ctx.fn.place(true);
        }
      }
    },
  };
}
