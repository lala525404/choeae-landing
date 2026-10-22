/** 히어로 라이브 데모, 인덱스 마인드맵, 시스템 정보 줄 */
import {twemojiSrc} from '../../constants';
import {$, $$, E, type Ctx} from './core';

const MSG = ['오늘 점심은 뭐예요?', '물 마셨어요?', '조금만 더 하면 퇴근!', '허리 펴요!', '퇴근까지 얼마 안 남았어요!'];
const EMO = ['1f389', '2728', '1f3c3', '1f38a', '1f680'];

/** 라이브 데모: 하트 버디가 돌아다니고 말풍선·알림 카드가 뜬다. 보이는 동안만 움직인다 */
export function initDemo(ctx: Ctx) {
  const {rm} = ctx;
  const mon = $('#mon');
  const buddy = $('#buddy');
  const bubble = $('#bubble');
  const notif = $('#notif');
  const scr = $('#monscr');
  const demo = {x: 0.1, dir: 1};
  let mi = 0;
  let card = 0;
  let cardT = 0;
  let bubT = 0;
  let sw = 0; // 화면 폭과 말풍선 폭: 말풍선이 데모 화면 밖으로 나가지 않게 보정할 때 쓴다
  let bw = 110;
  const measure = () => {
    sw = scr.clientWidth;
    bw = bubble.offsetWidth || 110;
  };
  const setClock = (s: string) => {
    $('#clk').textContent = s;
  };
  function showBubble() {
    bubble.textContent = MSG[mi++ % MSG.length];
    measure();
    bubble.classList.add('on');
    clearTimeout(bubT);
    bubT = window.setTimeout(() => bubble.classList.remove('on'), 2600);
  }
  function showCard() {
    const lunch = card++ % 2 === 0;
    $('#nt').textContent = lunch ? '점심시간이에요' : '퇴근 시간이에요';
    $('#ns').textContent = lunch ? '낮 12:00' : '오후 6:00';
    setClock(lunch ? '낮 12:00' : '오후 6:00');
    notif.classList.add('on');
    if (!rm) {
      const W0 = scr.clientWidth;
      const H0 = scr.clientHeight;
      for (let i = 0; i < 10; i++) {
        const e = document.createElement('img');
        e.className = 'rise';
        e.src = twemojiSrc(EMO[i % EMO.length]);
        e.alt = '';
        e.style.left = W0 * (0.15 + Math.random() * 0.7) + 'px';
        e.style.top = H0 + 'px';
        scr.append(e);
        e.animate(
          [
            {transform: 'translateY(0) scale(.7)', opacity: 0},
            {opacity: 1, offset: 0.2},
            {transform: `translate(${(Math.random() - 0.5) * 50}px,${-H0 * (0.55 + Math.random() * 0.4)}px) scale(1)`, opacity: 0},
          ],
          {duration: 1100 + Math.random() * 700, delay: Math.random() * 400, easing: E, fill: 'forwards'},
        ).onfinish = () => e.remove();
      }
    }
    clearTimeout(cardT);
    cardT = window.setTimeout(() => {
      notif.classList.remove('on');
      setClock(lunch ? '오후 12:05' : '오후 6:05');
    }, 2800);
  }
  let on = false;
  let dLast = 0;
  let seq: number[] = [];
  function frame(now: number) {
    if (!on) return;
    requestAnimationFrame(frame);
    if (document.hidden) return;
    const dt = Math.min(64, now - dLast);
    dLast = now;
    const W0 = scr.clientWidth - 46;
    demo.x += ((demo.dir * dt) / 1000) * 38 / W0;
    if (demo.x > 0.9) {
      demo.x = 0.9;
      demo.dir = -1;
    }
    if (demo.x < 0.04) {
      demo.x = 0.04;
      demo.dir = 1;
    }
    const bob = Math.abs(Math.sin(now / 260)) * -4;
    const xx = demo.x * W0;
    buddy.style.transform = `translate3d(${xx.toFixed(1)}px,${bob.toFixed(1)}px,0) scaleX(${demo.dir})`;
    bubble.style.transform = `translate3d(${Math.max(4, Math.min(xx - 10, sw - bw - 4)).toFixed(1)}px,0,0)`;
  }
  function start() {
    if (on || rm) return;
    on = true;
    dLast = performance.now();
    measure();
    requestAnimationFrame(frame);
    const loop = () => {
      seq.forEach(clearTimeout);
      seq = [
        window.setTimeout(showBubble, 1200),
        window.setTimeout(showCard, 5200),
        window.setTimeout(showBubble, 10000),
        window.setTimeout(showCard, 13500),
        window.setTimeout(() => {
          if (on) loop();
        }, 18500),
      ];
    };
    loop();
  }
  function stop() {
    on = false;
    seq.forEach(clearTimeout);
    clearTimeout(cardT);
    clearTimeout(bubT);
  }
  if (rm) {
    measure();
    buddy.style.transform = 'translate3d(260%,0,0)';
    bubble.textContent = MSG[0];
    bubble.classList.add('on');
    bubble.style.transform = 'translate3d(190px,0,0)';
    notif.style.display = 'none';
  }
  ctx.on(window, 'resize', measure);
  const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? start() : stop())), {threshold: 0.2});
  io.observe(mon);
  ctx.disposers.push(() => {
    io.disconnect();
    stop();
  });
}

/** 인덱스 마인드맵: 노드가 가볍게 떠다니고 연결선이 따라간다 */
export function initMap(ctx: Ctx) {
  const {rm, st} = ctx;
  const map = $('#map');
  const svg = $<SVGSVGElement>('#lines');
  const nodes = $$<HTMLElement>('#map .node');
  const lines = nodes.map(() => {
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    svg.append(l);
    return l;
  });
  let on = false;
  function frame(now: number) {
    if (!on) return;
    requestAnimationFrame(frame);
    if (ctx.mobile() || st.zooming) return;
    const r = map.getBoundingClientRect();
    const cx = r.width * 0.5;
    const cy = r.height * 0.52;
    nodes.forEach((n, i) => {
      const dx = rm ? 0 : Math.sin((now / 1000) * 0.6 + i * 1.7) * 7;
      const dy = rm ? 0 : Math.cos((now / 1000) * 0.5 + i * 2.1) * 6;
      n.style.setProperty('--dx', dx.toFixed(1) + 'px');
      n.style.setProperty('--dy', dy.toFixed(1) + 'px');
      const nx = n.offsetLeft + dx; // 실제 자리(낮은 화면에서 CSS가 옮긴 위치 포함)
      const ny = n.offsetTop + dy;
      const a = Math.atan2(ny - cy, nx - cx);
      const l = lines[i];
      l.setAttribute('x1', String(cx + Math.cos(a) * 88));
      l.setAttribute('y1', String(cy + Math.sin(a) * 88));
      l.setAttribute('x2', String(nx - Math.cos(a) * Math.min(110, Math.abs(nx - cx) * 0.45)));
      l.setAttribute('y2', String(ny - Math.sin(a) * 40));
      l.classList.toggle('on', st.lookEl === n);
    });
  }
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          if (!on) {
            on = true;
            requestAnimationFrame(frame);
          }
        } else on = false;
      }),
    {threshold: 0.1},
  );
  io.observe($('#index'));
  ctx.disposers.push(() => {
    on = false;
    io.disconnect();
  });
}

/** 측정 가능한 시스템 정보만 낮은 대비로(세션 시간·클릭 수·창 크기) */
export function initSys(ctx: Ctx) {
  const t0 = performance.now();
  const el = $('#sys');
  const update = () => {
    const s = ((performance.now() - t0) / 1000) | 0;
    el.textContent = `세션 ${String((s / 60) | 0).padStart(2, '0')}:${String(s % 60).padStart(2, '0')} · 클릭 ${ctx.st.clicks} · ${innerWidth}×${innerHeight}`;
  };
  const timer = window.setInterval(update, 1000);
  update();
  ctx.disposers.push(() => clearInterval(timer));
}
