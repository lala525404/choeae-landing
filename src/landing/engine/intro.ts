/** 인트로 시간표, 인트로 장식, 줌인 전환(인트로 → 메인), "처음으로" 복귀
 *
 * ══════════ 인트로 시간표 (CONFIG.intro, ms) ══════════
 *   0–500      하트(위 24px에서 내려앉으며 나타남)
 *   200–700    앱 이름(h1)
 *   400–900    "최애를 불러오는 중…" + 로딩 막대
 *   900–2500   한 줄 문구가 스크램블(1,600ms)로 정리됨  → 2500에 완전히 읽힘
 *   2500       "조용한 모드" 해제: 눈 추적 · 커서 트레일 · 지나가는 펫 실루엣 · 이름 주변 반짝임 시작
 *   3000–3300  버튼 2개 + 신뢰 문구가 문구 아래에서 나타남(문구는 그대로, 가리지 않음). 3000부터 클릭·Tab 가능
 *   문구는 자동으로 사라지지 않고 줌인 때까지 남는다. 인트로 동안 스크롤은 잠겨 있고, 메인으로 가는 길은 줌인뿐이다.
 *
 * ══════════ 줌인 전환 ══════════
 *   기본 1,250ms: scale 0–820 · 인트로 글자 0–300 사라짐 · 밝기 오버레이 250–870(사인 곡선 620ms) · ~890 오버레이가 덮은 채 이동 · 890–1250 걷힘.
 *   건너뛰기·Esc·"바로 다운받기"는 같은 전환을 900ms로 "빠르게 재생"한다(그냥 사라지지 않음). 이미 재생 중일 때 다시 누르면 즉시 마무리.
 *   transform·opacity만 쓰고 레이아웃을 건드리지 않는다. 주소는 replaceState(히스토리에 남기지 않음 → 뒤로 가기 = 사이트를 떠남). */
import {CAT, CONFIG, E, $, $$, instantScroll, rnd, scrambleTo, stopScramble, store, type Ctx} from './core';
import {HeartLiteHtml} from './heartHtml';

interface IntroState {
  ready: boolean;
  anims: Animation[];
  timers: number[];
}

export function initIntro(ctx: Ctx) {
  const {rm, touch, st, root} = ctx;
  const introEl = $('#intro');
  const ic = $('#ic');
  const boot = $('#bootmsg');
  const zoomer = $('#zoomer');
  const stage = $('#stage');
  const veil = $('#veil');
  const lockEl = $('#lock');
  const skipBtn = $<HTMLButtonElement>('#skip');
  const fxEl = $('#fx');
  const walker = $('#walker');
  const bootbar = $('#bootbar');
  const lateEls = [$('#entry'), $('#itrust')];
  const intro: IntroState = {ready: false, anims: [], timers: []};
  const markSeen = () => store.set('choeae-intro', '1');
  const zone = () => root.dataset.zone;
  let walkT = 0;
  walker.innerHTML = HeartLiteHtml;
  ctx.disposers.push(() => {
    clearTimeout(walkT);
    intro.anims.forEach((a) => a.cancel());
  });

  /* 인트로 장식(예외): 개수 상한 = 떠다니는 별·하트 10 + 가루 24(4개 레이어) + 이름 반짝임 6 + 펫 실루엣 1. 터치는 6 + 12(2개 레이어) + 6, 움직임 줄이기는 없음 */
  function buildDecor() {
    fxEl.textContent = '';
    if (rm || zone() !== 'intro') return;
    const ir = introEl.getBoundingClientRect();
    if (!ir.width) return;
    const sl = ctx.slotOf('intro').getBoundingClientRect();
    const cx = sl.left + sl.width / 2 - ir.left;
    const cy = sl.top + sl.height / 2 - ir.top;
    const sc = Math.min(1, innerWidth / 1000) * (ctx.mobile() ? 0.75 : 1);
    const texts = [$('#h-intro'), boot, $('#entry'), $('#itrust')].map((e) => e.getBoundingClientRect()).filter((r) => r.width);
    // 글자 영역(여유 포함)은 피한다
    const L = Math.min(...texts.map((r) => r.left)) - 28 - ir.left;
    const R = Math.max(...texts.map((r) => r.right)) + 28 - ir.left;
    const T = Math.min(...texts.map((r) => r.top)) - 20 - ir.top;
    const B = Math.max(...texts.map((r) => r.bottom)) + 20 - ir.top;
    const add = (cls: string, style = '') => {
      const d = document.createElement('i');
      d.className = 'fx-i ' + cls;
      if (style) d.style.cssText = style;
      fxEl.append(d);
      return d;
    };
    // 움직임은 CSS 변수 키프레임이 아니라 WAAPI(값을 미리 계산)로 건다: 변수가 들어간 키프레임은 프레임마다 스타일을 다시 계산해서 느린 폰에서 메인 스레드를 많이 쓴다
    const loop = (el: HTMLElement, kf: Keyframe[], dur: number, delay: number) => el.animate(kf, {duration: dur, delay: -delay, iterations: Infinity, easing: 'ease-in-out'});
    const nFl = touch ? 6 : 10;
    const nGrp = touch ? 2 : 4;
    const perGrp = 6; // 가루는 그룹당 한 레이어(box-shadow 점 6개)라 레이어 수가 적다
    for (let i = 0; i < nFl; i++) {
      const a = rnd(-Math.PI * 1.12, Math.PI * 0.12);
      const r = rnd(120, 250) * sc;
      const x = Math.round(cx + Math.cos(a) * r * 1.25);
      const y = Math.round(cy + Math.sin(a) * r * 0.85);
      const dx = Math.round(rnd(-14, 14));
      const dy = Math.round(rnd(-18, -4));
      const rot = Math.round(rnd(-35, 35));
      const o = rnd(0.35, 0.85).toFixed(2);
      const sz = Math.round(rnd(8, 16));
      const start = `translate(${x}px,${y}px) scale(.6) rotate(0deg)`;
      const el = add(`${i % 3 === 0 ? 'fx-heart' : 'fx-star'}`, `--sz:${sz}px`);
      loop(
        el,
        [
          {opacity: 0, transform: start},
          {opacity: Number(o), offset: 0.18},
          {opacity: Number(o), transform: `translate(${x + dx}px,${y + dy}px) scale(1) rotate(${rot}deg)`, offset: 0.5},
          {opacity: Number(o), offset: 0.82},
          {opacity: 0, transform: start},
        ],
        rnd(5, 9) * 1000,
        rnd(0, 8) * 1000,
      );
    }
    for (let g = 0; g < nGrp; g++) {
      const dots: string[] = [];
      for (let n = 0; dots.length < perGrp && n < 600; n++) {
        const x = rnd(10, ir.width - 10);
        const y = rnd(10, ir.height - 10);
        if (x > L && x < R && y > T && y < B) continue;
        if (Math.hypot(x - cx, y - cy) < 70) continue;
        dots.push(`${x.toFixed(0)}px ${y.toFixed(0)}px 0 0 #fff`);
      }
      const el = add('fx-dg', `box-shadow:${dots.join(',')}`);
      loop(el, [{opacity: 0}, {opacity: rnd(0.5, 0.85)}, {opacity: 0}], rnd(2.4, 4.2) * 1000, g * 1100);
    }
    const hr = $('#h-intro').getBoundingClientRect();
    const hx = hr.left - ir.left;
    const hy = hr.top - ir.top;
    // 이름 주변 반짝임: 문구가 읽힌 뒤(decorOn)에 시작한다
    ([[-0.07, -0.28], [0.2, -0.4], [0.58, -0.42], [1.06, -0.18], [1.0, 1.18], [-0.05, 1.14]] as const).forEach(([fx, fy], i) => {
      const x = Math.round(hx + hr.width * fx);
      const y = Math.round(hy + hr.height * fy);
      const el = add('ns fx-star', `--sz:${i % 2 ? 9 : 12}px`);
      const tf = `translate(${x}px,${y}px)`;
      const a = loop(el, [{opacity: 0, transform: `${tf} scale(.4)`}, {opacity: 0.85, transform: `${tf} scale(1)`}, {opacity: 0, transform: `${tf} scale(.4)`}], (1.8 + i * 0.35) * 1000, i * 400);
      a.pause();
      (el as HTMLElement & {_a?: Animation})._a = a;
    });
  }
  function walkOnce() {
    if (zone() !== 'intro' || st.introQuiet || st.zooming || document.hidden || rm || touch) {
      scheduleWalk();
      return;
    }
    const w = innerWidth;
    const dir = Math.random() < 0.5 ? 1 : -1;
    const dur = rnd(8000, 11000);
    walker.style.bottom = (12 + Math.random() * 6).toFixed(0) + '%';
    const a = walker.animate(
      [
        {transform: `translateX(${dir > 0 ? -40 : w + 40}px) scaleX(${dir})`, opacity: 0},
        {opacity: 1, offset: 0.08},
        {opacity: 1, offset: 0.92},
        {transform: `translateX(${dir > 0 ? w + 40 : -40}px) scaleX(${dir})`, opacity: 0},
      ],
      {duration: dur, easing: 'linear'},
    );
    $('svg', walker).animate([{transform: 'translateY(0)'}, {transform: 'translateY(-4px)'}, {transform: 'translateY(0)'}], {duration: 620, iterations: Math.ceil(dur / 620)});
    a.finished.then(scheduleWalk).catch(() => {});
  }
  function scheduleWalk() {
    clearTimeout(walkT);
    walkT = window.setTimeout(walkOnce, rnd(5000, 10000));
  }
  const decorOn = () => {
    $$<HTMLElement & {_a?: Animation}>('.ns', fxEl).forEach((e) => e._a?.play());
    if (!rm && !touch) scheduleWalk();
  };
  const decorOff = () => {
    clearTimeout(walkT);
    walker.getAnimations().forEach((a) => a.cancel());
  };
  let resizeT = 0;
  ctx.on(window, 'resize', () => {
    clearTimeout(resizeT);
    resizeT = window.setTimeout(() => {
      if (zone() === 'intro' && !st.zooming) {
        buildDecor();
        if (intro.ready || !st.introQuiet) decorOn();
      }
    }, 250);
  });
  ctx.disposers.push(() => clearTimeout(resizeT));

  function endQuiet() {
    if (!st.introQuiet) return;
    st.introQuiet = false;
    decorOn();
  }
  /** 줌인 첫 프레임의 스타일·레이어 계산이 몰리지 않게, 버튼이 나타날 때 한 프레임 미리 돌려 둔다(화면에는 보이지 않음) */
  const warmZoom = () => {
    if (rm || st.zooming) return;
    root.classList.add('zooming');
    lockEl.hidden = false;
    veil.animate([{opacity: 0}, {opacity: 0}], {duration: 50});
    zoomer.animate([{transform: 'scale(1)'}, {transform: 'scale(1.001)'}], {duration: 50});
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        root.classList.remove('zooming');
        lockEl.hidden = true;
      }),
    );
  };
  function becomeReady() {
    if (intro.ready) return;
    intro.ready = true;
    endQuiet();
    lateEls.forEach((el) => {
      el.inert = false;
    });
    skipBtn.hidden = true;
    markSeen();
    performance.mark('intro:buttons');
    if (window.requestIdleCallback) requestIdleCallback(warmZoom, {timeout: 400});
    else ctx.timeout(warmZoom, 200);
  }
  /** 건너뛰기(줌인 빠르게 재생) 직전·"처음으로" 직전: 남은 연출을 모두 끝낸다 */
  ctx.fn.completeIntro = () => {
    if (intro.ready) return;
    intro.timers.forEach(clearTimeout);
    intro.anims.forEach((a) => {
      try {
        a.finish();
      } catch {
        /* 이미 끝났다 */
      }
    });
    stopScramble(boot, boot.dataset.text ?? '');
    bootbar.hidden = true;
    becomeReady();
  };
  /** 이미 본 방문자가 "처음으로"로 돌아왔을 때: 연출 없이 버튼이 나온 상태, 장식만 켠다 */
  ctx.fn.enterIntroReady = () => {
    intro.timers.forEach(clearTimeout);
    intro.ready = true;
    lateEls.forEach((el) => {
      el.inert = false;
    });
    stopScramble(boot, boot.dataset.text ?? '');
    bootbar.hidden = true;
    st.introQuiet = false;
    skipBtn.hidden = true;
    buildDecor();
    decorOn();
  };

  function start() {
    const C = CONFIG.intro;
    const A = (el: HTMLElement, kf: Keyframe[], o: KeyframeAnimationOptions) => {
      const a = el.animate(kf, {fill: 'backwards', easing: E, ...o});
      intro.anims.push(a);
      return a;
    };
    const ms = ctx.ms;
    performance.mark('intro:start'); // 시간표 측정용 표식(화면에는 영향 없음)
    st.introQuiet = true;
    skipBtn.hidden = false;
    skipBtn.textContent = '건너뛰기 · Esc';
    const final = boot.dataset.text ?? '';
    const readableAt = C.phraseAt + C.phraseMs;
    const buttonsAt = readableAt + C.buttonsGap;
    A(zoomer, rm ? [{opacity: 0}, {opacity: 1}] : [{opacity: 0, transform: 'translateY(-24px)'}, {opacity: 1, transform: 'none'}], {duration: ms(C.heart)});
    // 앱 이름(h1)은 미리 그려 둔 첫 화면에서 이미 보이므로 따로 연출하지 않는다(LCP). 하트가 내려앉고 문구가 이어진다
    if (!rm) {
      boot.textContent = '최애를 불러오는 중…';
      A(boot, [{opacity: 0}, {opacity: 1}], {delay: ms(C.bootAt), duration: ms(300)});
      A($('#bootfill'), [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], {delay: ms(C.bootAt), duration: ms(C.phraseAt - C.bootAt), easing: 'linear'});
      A(bootbar, [{opacity: 0}, {opacity: 1}], {delay: ms(C.bootAt), duration: ms(200)});
      intro.anims.push(bootbar.animate([{opacity: 1}, {opacity: 0}], {delay: ms(C.phraseAt), duration: ms(200), fill: 'forwards'}));
      intro.timers.push(ctx.timeout(() => scrambleTo(boot, final, ms(C.phraseMs), 70), ms(C.phraseAt)));
    } else {
      bootbar.hidden = true;
      A(boot, [{opacity: 0}, {opacity: 0.85}], {delay: ms(C.phraseAt), duration: ms(C.phraseMs), easing: 'ease-in-out'}); // 움직임 줄이기: 같은 시간 동안 부드러운 페이드
    }
    buildDecor();
    if (!rm) A(fxEl, [{opacity: 0}, {opacity: 1}], {delay: ms(700), duration: ms(600), easing: 'linear'});
    lateEls.forEach((el) => {
      el.inert = true;
      A(el, rm ? [{opacity: 0}, {opacity: 1}] : [{opacity: 0, transform: 'translateY(10px)'}, {opacity: 1, transform: 'none'}], {delay: ms(buttonsAt), duration: ms(C.buttonsMs)});
    });
    intro.timers.push(ctx.timeout(endQuiet, ms(readableAt)), ctx.timeout(becomeReady, ms(buttonsAt)));
    delete root.dataset.pre; // 연출이 걸렸으니 투명 상태를 푼다(시작 상태는 애니메이션의 backwards 채움이 이어받는다)
  }

  /* ══════════ 줌인 전환 ══════════ */
  const mainBg = () => (root.dataset.theme === 'dark' ? '#0F0F10' : '#F4F4F4');
  function setBusy(on: boolean) {
    root.classList.toggle('zooming', on);
    lockEl.hidden = !on;
  }
  interface ZoomCtl {
    jumped: boolean;
    timers: number[];
    anims: Animation[];
    fast: boolean;
    jump(): void;
  }
  let zctl: ZoomCtl | null = null;
  ctx.fn.zoomEnter = (opts = {}) => {
    if (st.zooming) return;
    st.zooming = true;
    markSeen();
    const target = opts.target ?? 'hero';
    const T = opts.fast ? CONFIG.zoomFastMs : CONFIG.zoomMs;
    const ms = ctx.ms;
    veil.style.background = mainBg();
    setBusy(true);
    skipBtn.hidden = false;
    skipBtn.textContent = '건너뛰기 · Esc';
    skipBtn.focus({preventScroll: true});
    decorOff();
    const c: ZoomCtl = (zctl = {jumped: false, timers: [], anims: [], fast: false, jump: () => {}});
    const jump = () => {
      if (c.jumped) return;
      c.jumped = true;
      c.anims.forEach((a) => {
        if ((a.effect as KeyframeEffect | null)?.target !== veil) a.cancel();
      });
      root.dataset.zone = 'main'; // 인트로 구역 해제: 스크롤 잠금이 풀리고 인트로가 레이아웃에서 빠진다
      if (opts.nonum) root.dataset.nonum = '';
      if (target !== 'hero' && (CAT as readonly string[]).includes(target)) st.directId = target;
      history.replaceState(null, '', '#' + target); // 줌인은 히스토리에 남기지 않는다
      instantScroll($('#' + target));
      requestAnimationFrame(() => {
        // 한 프레임에 몰리지 않게: 이동 → (오버레이가 덮은 채 한 프레임) → 활성화·하트 이동·걷힘
        ctx.fn.activate(target, true);
        stage.classList.add('jump');
        ctx.fn.place();
        requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.remove('jump')));
        const out = veil.animate([{opacity: 1}, {opacity: 0}], {duration: c.fast ? 200 : rm ? ms(160) : ms(T * 0.288), easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards'});
        if (!rm && !c.fast && target === 'hero') {
          $$('#hero > div').forEach((d, i) => d.animate([{opacity: 0, transform: 'translateY(10px)'}, {opacity: 1, transform: 'none'}], {delay: ms(60 + i * 80), duration: ms(320), easing: E, fill: 'backwards'}));
        }
        out.finished.then(zoomDone).catch(zoomDone);
      });
    };
    c.jump = jump;
    if (rm) {
      c.anims.push(veil.animate([{opacity: 0}, {opacity: 1}], {duration: ms(160), fill: 'forwards'}));
      c.timers.push(ctx.timeout(jump, ms(170)));
    } else {
      const s = parseFloat(stage.style.getPropertyValue('--s')) || 1;
      const k = Math.max(6, Math.min(16, (1.6 * Math.max(innerWidth, innerHeight)) / (180 * s)));
      zoomer.style.transformOrigin = '0px -12.6px'; // 눈 사이(하트 중심에서 위로 12.6px)로 빨려 들어간다
      c.anims.push(zoomer.animate([{transform: 'scale(1)'}, {transform: `scale(${k})`}], {duration: ms(T * 0.656), easing: 'cubic-bezier(.55,0,.85,.4)', fill: 'forwards'}));
      c.anims.push(ic.animate([{opacity: 1, transform: 'scale(1)'}, {opacity: 0, transform: 'scale(1.1)'}], {duration: ms(Math.min(300, T * 0.24)), easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards'}));
      c.anims.push(veil.animate([{opacity: 0}, {opacity: 1}], {delay: ms(T * 0.2), duration: ms(T * 0.496), easing: 'cubic-bezier(.37,0,.63,1)', fill: 'forwards'})); // 어두움→밝음 램프, 사인 곡선
      c.timers.push(ctx.timeout(jump, ms(T * 0.712)));
    }
    ctx.disposers.push(() => c.timers.forEach(clearTimeout));
    zoomTarget = target;
  };
  let zoomTarget = 'hero';
  function zoomDone() {
    if (!zctl) return;
    zctl.timers.forEach(clearTimeout);
    veil.getAnimations().forEach((a) => a.cancel());
    zoomer.getAnimations().forEach((a) => a.cancel());
    ic.getAnimations().forEach((a) => a.cancel());
    zoomer.style.transformOrigin = '';
    zctl = null;
    st.zooming = false;
    setBusy(false);
    skipBtn.hidden = true;
    const h = $('#h-' + zoomTarget); // 키보드 사용자: 도착한 화면 제목으로 포커스
    h.setAttribute('tabindex', '-1');
    h.focus({preventScroll: true});
  }
  /** 줌인 재생 중 Esc·건너뛰기: 즉시 끝낸다. 오버레이가 덜 덮였으면 120ms만 서둘러 덮어서 밝기가 갑자기 튀지 않게 한다 */
  function skipTransition() {
    if (!zctl) return;
    const c = zctl;
    c.fast = true;
    if (!c.jumped) {
      c.timers.forEach(clearTimeout);
      const cur = Number(getComputedStyle(veil).opacity);
      veil.getAnimations().forEach((a) => a.cancel());
      veil.style.opacity = String(cur);
      const a = veil.animate([{opacity: cur}, {opacity: 1}], {duration: cur > 0.98 ? 1 : 120, fill: 'forwards'});
      a.finished.then(() => {
        veil.style.opacity = '';
        c.jump();
      });
    } else {
      veil.getAnimations().forEach((a) => {
        try {
          a.finish();
        } catch {
          /* 이미 끝났다 */
        }
      });
    }
  }
  /** 인트로에서 건너뛰기·"바로 다운받기": 줌인을 빠르게 재생 */
  ctx.fn.fastZoom = (target = 'hero', nonum = false) => {
    ctx.fn.completeIntro();
    ctx.fn.zoomEnter({fast: true, target, nonum});
  };
  ctx.on(skipBtn, 'click', () => {
    if (st.zooming) skipTransition();
    else ctx.fn.fastZoom();
  });
  ctx.on(window, 'keydown', (e: KeyboardEvent) => {
    if (st.zooming && e.key === 'Tab') {
      e.preventDefault();
      skipBtn.focus();
      return;
    }
    if (e.key !== 'Escape') return;
    if (st.zooming) skipTransition();
    else if (zone() === 'intro') ctx.fn.fastZoom();
  });

  /** 메인 → 인트로 복귀("처음으로"): 오버레이가 인트로의 다크 바탕색으로 600ms 덮고(밝음→어두움, 같은 사인 곡선), 이동하고, 300ms에 걷힌다 */
  ctx.fn.returnToIntro = () => {
    if (st.zooming) return;
    st.zooming = true;
    ctx.fn.completeIntro();
    veil.style.background = '#0F0F10';
    setBusy(true);
    const ms = ctx.ms;
    const a = veil.animate([{opacity: 0}, {opacity: 1}], {duration: ms(rm ? 150 : 600), easing: 'cubic-bezier(.37,0,.63,1)', fill: 'forwards'});
    a.finished.then(() => {
      root.dataset.zone = 'intro';
      ctx.fn.enterIntroReady();
      history.replaceState(null, '', '#intro');
      instantScroll(introEl);
      ctx.fn.activate('intro', true);
      stage.classList.add('jump');
      ctx.fn.place();
      requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.remove('jump')));
      const out = veil.animate([{opacity: 1}, {opacity: 0}], {duration: ms(rm ? 150 : 300), easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards'});
      out.finished.then(() => {
        veil.getAnimations().forEach((x) => x.cancel());
        st.zooming = false;
        setBusy(false);
        const h = $('#h-intro');
        h.setAttribute('tabindex', '-1');
        h.focus({preventScroll: true});
      });
    });
  };

  return {
    start,
    isReady: () => intro.ready,
    markReadyStatic() {
      intro.ready = true;
      bootbar.hidden = true;
    },
  };
}
