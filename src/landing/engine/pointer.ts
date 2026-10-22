/** 큰 하트(눈 추적·기울임·반사광), 커서 따라다니는 펫, 스파클, 3D·펫·테마·단축키 토글, 하트 자리 옮기기 */
import {$, E, store, type Cached, type Ctx} from './core';

const INTERACTIVE = 'a,button,summary,[role=tab],.tb,[data-avoid],input,textarea,select,.dl,.fc';

interface Spark {
  el: HTMLElement;
  live: boolean;
  trail: boolean;
  t0: number;
  d: number;
  dx: number;
  dy: number;
  rot: number;
}

export function initPointer(ctx: Ctx) {
  const {rm, touch, st, body, root} = ctx;
  const heart = $<Cached>('#heart');
  const tilt = $<Cached>('#tilt');
  const look = $<Cached & SVGElement & HTMLElement>('#look');
  const spec = $<Cached & HTMLElement>('#spec');
  const bounce = $<Cached & HTMLElement>('#bounce');
  const hshadow = $<Cached>('#hshadow');
  const pet = $('#pet');
  const petEyes = $<Cached & HTMLElement>('#pet .peyes');
  const stage = $('#stage');

  /* ── 상태(저장). ?3d=off, ?pet=off 로 캡처용 고정 가능 ── */
  st.no3d = rm || store.get('choeae-3d') === 'off' || ctx.q.get('3d') === 'off';
  st.petOff = store.get('choeae-pet') === 'off' || ctx.q.get('pet') === 'off';
  st.keysOff = store.get('choeae-keys') === 'off';

  const sync3d = () => {
    body.classList.toggle('no3d', st.no3d);
    $('#t3d').setAttribute('aria-pressed', String(st.no3d));
    $('#t3dl').textContent = st.no3d ? '3D 켜기' : '3D 끄기';
  };
  const syncPet = () => {
    body.classList.toggle('nopet', st.petOff);
    $('#tPet').setAttribute('aria-pressed', String(st.petOff));
    $('#tPetL').textContent = st.petOff ? '펫 따라오기 켜기' : '펫 따라오기 끄기';
    $('#tPetS').textContent = st.petOff ? '펫 켜기' : '펫 끄기';
  };
  const syncKeys = () => {
    $('#tKeys').setAttribute('aria-pressed', String(st.keysOff));
    $('#tKeysL').textContent = st.keysOff ? '단축키 켜기' : '단축키 끄기';
    $('#tKeysS').textContent = st.keysOff ? '단축키 켜기' : '단축키';
  };
  sync3d();
  syncPet();
  syncKeys();
  ctx.on($('#t3d'), 'click', () => {
    st.no3d = !st.no3d;
    store.set('choeae-3d', st.no3d ? 'off' : 'on');
    sync3d();
    if (st.no3d) resetTransforms();
  });
  ctx.on($('#tPet'), 'click', () => {
    st.petOff = !st.petOff;
    store.set('choeae-pet', st.petOff ? 'off' : 'on');
    syncPet();
  });
  ctx.on($('#tKeys'), 'click', () => {
    st.keysOff = !st.keysOff;
    store.set('choeae-keys', st.keysOff ? 'off' : 'on');
    syncKeys();
  });
  // 인트로는 다크 고정이라 테마 전환을 무시한다
  const theme = () => {
    if (root.dataset.zone === 'intro') return;
    const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = t;
    store.set('choeae-theme', t);
  };
  if (ctx.q.get('theme')) root.dataset.theme = ctx.q.get('theme') ?? 'light';
  ctx.on($('#tTheme'), 'click', theme);
  /* 한 글자 단축키(D·L) — 입력창에 포커스가 있거나 "단축키 끄기"면 동작하지 않는다(WCAG 2.1.4) */
  ctx.on(window, 'keydown', (e: KeyboardEvent) => {
    const t = e.target as HTMLElement;
    if (st.keysOff || t.closest?.('input,textarea,select,[contenteditable]') || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === 'd') theme();
    else if (k === 'l') ctx.fn.resetWindows();
  });

  /* ── 포인터 상태 ── */
  let px = innerWidth * 0.6;
  let py = innerHeight * 0.4;
  let seen = 0;
  let vx = 0;
  let vy = 0;
  let lastPX = px;
  let lastPY = py;
  let lastPT = performance.now();
  let spd = 0;
  ctx.on(
    window,
    'pointermove',
    (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const n = performance.now();
      const dt = Math.max(8, n - lastPT);
      vx = ((e.clientX - lastPX) / dt) * 1000;
      vy = ((e.clientY - lastPY) / dt) * 1000;
      spd = spd * 0.6 + Math.hypot(vx, vy) * 0.4;
      lastPX = px = e.clientX;
      lastPY = py = e.clientY;
      lastPT = n;
      seen = n;
      st.moved = true;
    },
    {passive: true},
  );
  ctx.on(document, 'pointerover', (e: PointerEvent) => {
    const target = e.target as HTMLElement;
    const t = target.closest?.<HTMLElement>('[data-look]');
    if (t) {
      st.lookEl = t;
      if (t.hasAttribute('data-fx')) ctx.fn.burstFrom(t, t.classList.contains('btn') ? 10 : 4);
    }
    // 펫이 링크·버튼·제목 표시줄 위에서는 비켜서서 글자를 가리지 않는다
    st.avoid = !!target.closest?.(INTERACTIVE);
  });
  ctx.on(document, 'pointerout', (e: PointerEvent) => {
    const t = (e.target as HTMLElement).closest?.('[data-look]');
    if (st.lookEl && t === st.lookEl && !st.lookEl.contains(e.relatedTarget as Node | null)) st.lookEl = null;
  });
  ctx.on(document, 'focusin', (e: FocusEvent) => {
    const t = (e.target as HTMLElement).closest?.<HTMLElement>('[data-look]');
    if (t) {
      st.lookEl = t;
      if (t.matches(':focus-visible') && t.hasAttribute('data-fx')) ctx.fn.burstFrom(t, t.classList.contains('btn') ? 10 : 4);
    }
  });
  ctx.on(document, 'focusout', () => {
    st.lookEl = null;
  });

  /* ── 스파클: 풀 48개. 트레일(상한 14, 인트로 24)과 버스트가 나눠 쓴다. 터치·움직임 줄이기·인트로 조용한 모드에선 끔 ── */
  const pool: Spark[] = Array.from({length: 48}, () => {
    const i = document.createElement('i');
    i.className = 'spark';
    i.setAttribute('aria-hidden', 'true');
    document.body.append(i);
    return {el: i, live: false, trail: false, t0: 0, d: 0, dx: 0, dy: 0, rot: 0};
  });
  ctx.disposers.push(() => pool.forEach((p) => p.el.remove()));
  let trailLive = 0;
  let trailCap = 14;
  function emit(x: number, y: number, n: number, burst?: boolean, size?: number, drift?: number) {
    if (rm || touch || st.introQuiet) return;
    for (let i = 0; i < n; i++) {
      const p = pool.find((s) => !s.live);
      if (!p) return;
      if (!burst && trailLive >= trailCap) return;
      const a = burst ? Math.random() * 6.28 : -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
      const far = burst ? 30 + Math.random() * 50 : (drift || 16) * (0.5 + Math.random());
      Object.assign(p, {
        live: true,
        trail: !burst,
        t0: performance.now() + (burst ? Math.random() * 120 : 0),
        d: burst ? 700 + Math.random() * 300 : 600 + Math.random() * 200,
        dx: Math.cos(a) * far,
        dy: Math.sin(a) * far - (burst ? 0 : 6),
        rot: (Math.random() - 0.5) * 120,
      });
      const intr = root.dataset.zone === 'intro';
      p.el.className = 'spark' + (intr && Math.random() < 0.35 ? ' hs' : '');
      const s = size || (burst ? 4 + Math.random() * 5 : intr ? 4 + Math.random() * 5 : 3 + Math.random() * 3);
      Object.assign(p.el.style, {left: x - s / 2 + 'px', top: y - s / 2 + 'px', width: s + 'px', height: s + 'px'});
      if (!burst) trailLive++;
    }
  }
  function sparkTick(now: number) {
    for (const p of pool) {
      if (!p.live) continue;
      const t = (now - p.t0) / p.d;
      if (t < 0) continue;
      if (t >= 1) {
        p.live = false;
        if (p.trail) trailLive--;
        p.el.style.opacity = '0';
        continue;
      }
      const e = 1 - Math.pow(1 - t, 3);
      p.el.style.transform = `translate3d(${p.dx * e}px,${p.dy * e}px,0) rotate(${p.rot * e}deg) scale(${1 - 0.6 * t})`;
      p.el.style.opacity = String((t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85) * 0.85);
    }
  }
  let lastFx = 0;
  ctx.fn.burstFrom = (el, n) => {
    if (rm || touch || st.introQuiet || st.zooming) return;
    const now = performance.now();
    if (now - lastFx < 400) return;
    lastFx = now;
    const hr = heart.getBoundingClientRect();
    const br = el.getBoundingClientRect();
    if (n >= 8) heart.animate([{scale: '1'}, {scale: '1.07', offset: 0.4}, {scale: '1'}], {duration: 360, easing: E});
    for (let i = 0; i < n; i++) {
      if (i % 2 === 0 && n >= 8) emit(hr.left + hr.width / 2 + Math.cos(i) * hr.width * 0.4, hr.top + hr.height * 0.45 + Math.sin(i * 2) * hr.width * 0.38, 1, true);
      else emit(br.left + Math.random() * br.width, br.top + br.height * 0.25, 1, true);
    }
  };
  ctx.on(window, 'pointerdown', (e: PointerEvent) => {
    st.clicks++;
    if (e.pointerType === 'touch' || rm || st.petOff || !st.moved || st.introQuiet) return;
    pet.animate([{scale: '1'}, {scale: '1.4', offset: 0.35}, {scale: '1'}], {duration: 360, easing: E});
    emit(pX + 17, pY + 17, 5, true);
  });

  /* ── 큰 하트: 눈 추적 · 기울임 · 반사광 시차 (부유는 CSS) ── */
  let lx = 0;
  let ly = 0;
  let tx = 0;
  let ty = 0;
  let last = performance.now();
  let pX = -100;
  let pY = -100;
  let lastEmit = 0;
  let lastEmX = 0;
  let lastEmY = 0;
  let petLX = 0;
  let petLY = 0;
  function resetTransforms() {
    [look, spec, bounce].forEach((e) => {
      e._v = null;
    });
    [heart, tilt, hshadow].forEach((e) => {
      e._transform = null;
    });
    tilt.style.transform = '';
    heart.style.transform = '';
    look.removeAttribute('transform');
    spec.removeAttribute('transform');
    bounce.removeAttribute('transform');
    hshadow.style.transform = '';
    hshadow.style.opacity = '';
  }
  ctx.fn.resetTransforms = resetTransforms;
  const mascotMode = touch || rm;
  const setA = (el: Cached, v: string) => {
    if (el._v !== v) {
      el._v = v;
      el.setAttribute('transform', v);
    }
  };
  const setT = (el: Cached, v: string) => {
    if (el._transform !== v) {
      el._transform = v;
      el.style.transform = v;
    }
  };
  let alive = true;
  ctx.disposers.push(() => {
    alive = false;
  });
  function frame(now: number) {
    if (!alive) return;
    requestAnimationFrame(frame);
    if (document.hidden) return;
    const dt = Math.min(64, now - last);
    last = now;
    if (!rm && !st.zooming) {
      let ex = 0;
      let ey = 0;
      let ok = false;
      let tx0 = 0;
      let ty0 = 0;
      if (!st.introQuiet) {
        // 인트로 조용한 모드에서는 눈이 가운데를 본다
        if (st.lookEl) {
          const b = st.lookEl.getBoundingClientRect();
          tx0 = b.left + b.width / 2;
          ty0 = b.top + b.height / 2;
          ok = true;
        } else if (st.moved && now - seen < 3000 && !touch) {
          tx0 = px;
          ty0 = py;
          ok = true;
        }
      }
      if (ok) {
        // 보는 곳이 있을 때만 하트 위치를 읽는다(글자가 바뀌는 동안 매 프레임 레이아웃을 강제하지 않게)
        const r = heart.getBoundingClientRect();
        const dx = tx0 - (r.left + r.width / 2);
        const dy = ty0 - (r.top + r.height * 0.45);
        const d = Math.hypot(dx, dy) || 1;
        const k = 1 - Math.exp(-d / (r.width * 0.55));
        const m = 6.5;
        ex = (dx / d) * k * m;
        ey = (dy / d) * k * m * 0.62;
      }
      lx += (ex - lx) * (1 - Math.exp(-dt / 70));
      ly += (ey - ly) * (1 - Math.exp(-dt / 70));
      const nx = lx / 6.5;
      const ny = ly / (6.5 * 0.62);
      tx += (nx - tx) * (1 - Math.exp(-dt / 90));
      ty += (ny - ty) * (1 - Math.exp(-dt / 90));
      if (!st.no3d) {
        // 값이 바뀔 때만 쓴다
        setT(heart, `translate3d(${(tx * 7).toFixed(1)}px,0,0)`);
        setT(tilt, `perspective(620px) rotateX(${(-ty * 13).toFixed(1)}deg) rotateY(${(tx * 13).toFixed(1)}deg)`);
        setA(look, `translate(${(lx + tx * 3).toFixed(1)} ${(ly + ty * 2.4).toFixed(1)})`);
        setA(spec, `translate(${(-tx * 9).toFixed(1)} ${(-ty * 7).toFixed(1)})`);
        setA(bounce, `translate(${(tx * 6).toFixed(1)} ${(ty * 5).toFixed(1)})`);
        setT(hshadow, `translate3d(${(tx * -10).toFixed(1)}px,0,0)`);
      } else setA(look, `translate(${lx.toFixed(1)} ${ly.toFixed(1)})`);
    }
    if (st.introQuiet) {
      pet.style.opacity = '0';
      pX = -100;
    } else if (!st.petOff && !mascotMode && st.moved) {
      const idle = now - seen;
      let ox = 22;
      let oy = 20;
      if (st.avoid) {
        ox = 40;
        oy = -50;
      }
      let gx = px + ox;
      let gy = py + oy;
      if (idle > 1200) {
        const a = now / 650;
        gx += Math.cos(a) * 18;
        gy += Math.sin(a) * 10;
      }
      gx = Math.min(innerWidth - 40, Math.max(6, gx));
      gy = Math.min(innerHeight - 40, Math.max(6, gy));
      if (pX < -50) {
        pX = gx;
        pY = gy;
        pet.style.opacity = '1';
      }
      const k = 1 - Math.exp(-dt / 150);
      pX += (gx - pX) * k;
      pY += (gy - pY) * k;
      pet.style.transform = `translate3d(${pX.toFixed(1)}px,${pY.toFixed(1)}px,0) rotate(${Math.max(-12, Math.min(12, (gx - pX) * 0.4)).toFixed(1)}deg)`;
      let ex = 0;
      let ey = 0;
      if (st.lookEl) {
        const b = st.lookEl.getBoundingClientRect();
        const dx = b.left + b.width / 2 - (pX + 17);
        const dy = b.top + b.height / 2 - (pY + 17);
        const d = Math.hypot(dx, dy) || 1;
        ex = (dx / d) * 5;
        ey = (dy / d) * 4;
      } else if (spd > 700 && idle < 200) {
        const d = Math.hypot(vx, vy) || 1;
        ex = (vx / d) * 7;
        ey = (vy / d) * 5; // 빠르게 움직이면 눈이 쏠린다
      } else {
        const dx = px - (pX + 17);
        const dy = py - (pY + 17);
        const d = Math.hypot(dx, dy) || 1;
        ex = (dx / d) * 3.5;
        ey = (dy / d) * 3;
      }
      petLX += (ex - petLX) * (1 - Math.exp(-dt / 60));
      petLY += (ey - petLY) * (1 - Math.exp(-dt / 60));
      setA(petEyes, `translate(${petLX.toFixed(1)} ${petLY.toFixed(1)})`);
      pet.classList.toggle('sleepy', idle > 5000); // 오래 멈추면 졸린 듯 천천히 깜빡
      spd *= Math.pow(0.2, dt / 1000);
    }
    /* 스파클 트레일: 펫이 있으면 펫 주변에서, 펫을 끄면 커서에서. 움직일 때만, 멈추면 가끔 */
    if (!rm && !touch && !st.introQuiet && st.moved) {
      const sx = st.petOff ? px : pX + 17;
      const sy = st.petOff ? py : pY + 17;
      const idle = now - seen;
      const intr = root.dataset.zone === 'intro';
      trailCap = intr ? 24 : 14; // 인트로는 트레일을 더 촘촘하고 크게(상한 24)
      if (idle < 900 && now - lastEmit > (intr ? 60 : 110) && Math.hypot(sx - lastEmX, sy - lastEmY) > (intr ? 18 : 30)) {
        lastEmit = now;
        lastEmX = sx;
        lastEmY = sy;
        emit(sx + (Math.random() - 0.5) * 14, sy + (Math.random() - 0.5) * 14, 1, false);
      } else if (idle > 1200 && idle < 5000 && now - lastEmit > 900) {
        lastEmit = now;
        emit(sx, sy, 1, false);
      }
    }
    if (trailLive > 0 || pool.some((p) => p.live)) sparkTick(now);
  }
  if (mascotMode) pet.classList.add('mascot');
  requestAnimationFrame(frame);

  /* ── 하트 위치: 보이는 화면에 맞춰 옮김. 카테고리에서는 제목 줄 오른쪽 위에 작게(창과 겹치지 않는 자리) ── */
  ctx.fn.place = (first) => {
    const sec = body.dataset.sec || 'intro';
    let x: number;
    let y: number;
    let s: number;
    if (ctx.mobile()) {
      const r = ctx.slotOf(sec === 'intro' ? 'intro' : 'hero').getBoundingClientRect();
      x = r.left + r.width / 2 + scrollX;
      y = r.top + r.height / 2 + scrollY;
      s = 0.75;
    } else if (sec === 'intro') {
      const r = ctx.slotOf('intro').getBoundingClientRect();
      x = r.left + r.width / 2;
      y = r.top + r.height / 2;
      s = 1.05;
    } else if (sec === 'hero') {
      const r = ctx.slotOf('hero').getBoundingClientRect();
      x = r.left + r.width / 2;
      y = r.top + r.height / 2;
      s = Math.min(0.86, (r.height - 12) / 180); // 하트가 칸 밖으로 나가 글자를 가리지 않게
    } else if (sec === 'index') {
      const r = ctx.slotOf('index').getBoundingClientRect();
      x = r.left;
      y = r.top;
      s = 1.12;
    } else {
      x = innerWidth - 70;
      y = innerHeight <= 700 ? 102 : 114;
      s = 0.38;
    }
    stage.style.setProperty('--tx', x + 'px');
    stage.style.setProperty('--ty', y + 'px');
    stage.style.setProperty('--s', String(s));
    if (first || ctx.mobile()) stage.classList.add('jump');
    if (first && !ctx.mobile()) requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.remove('jump')));
  };
}
