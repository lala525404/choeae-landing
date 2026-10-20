import {useLayoutEffect, useRef, useState} from 'react';
import {DEMO_BUDDY, twemojiSrc} from '../constants';
import {useReducedMotion} from '../hooks/useReducedMotion';

const SPEED = 40; // px/s
const TURN_PAUSE = 0.4; // 끝에서 멈추는 시간(초)
const EDGE = 6; // 포커스 링이 잘리지 않도록 스테이지 끝에서 띄우는 거리(px)

/**
 * 히어로 스테이지: 고양이 버디가 좌우로 왕복한다.
 * 화면 밖이거나 탭이 숨겨지면 멈추고, 움직임 줄이기에서는 가운데 정지 이미지만 보여 준다.
 */
export function BuddyStage() {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLSpanElement>(null);
  const bobRef = useRef<HTMLSpanElement>(null);
  const [jumping, setJumping] = useState(false);

  // 첫 화면이 그려지기 전에 위치를 잡아 왼쪽 끝에서 깜빡이지 않게 한다.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const mover = moverRef.current;
    const flip = flipRef.current;
    const bob = bobRef.current;
    if (reduced || !stage || !mover || !flip || !bob) return;

    let width = stage.clientWidth;
    let size = mover.offsetWidth;
    let x = Math.max(EDGE, (width - size) / 2);
    let dir = 1;
    let pause = 0;
    let last = 0;
    let frame = 0;
    let onScreen = false;

    const render = () => {
      mover.style.transform = `translate3d(${x}px, 0, 0)`;
    };
    const setIdle = (idle: boolean) => {
      bob.dataset.idle = String(idle);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (pause > 0) {
        pause -= dt;
        if (pause <= 0) {
          pause = 0;
          dir = -dir;
          flip.style.transform = `scaleX(${dir})`;
          setIdle(false);
        }
      } else {
        x += dir * SPEED * dt;
        const max = Math.max(EDGE, width - size - EDGE);
        if ((dir < 0 && x <= EDGE) || (dir > 0 && x >= max)) {
          x = Math.min(max, Math.max(EDGE, x));
          pause = TURN_PAUSE;
          setIdle(true);
        }
        render();
      }
      frame = requestAnimationFrame(tick);
    };

    const sync = () => {
      const run = onScreen && !document.hidden;
      if (run && !frame) {
        last = performance.now();
        setIdle(pause > 0);
        frame = requestAnimationFrame(tick);
      } else if (!run && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
        setIdle(true);
      }
    };

    render();
    setIdle(true);

    const resize = new ResizeObserver(() => {
      width = stage.clientWidth;
      size = mover.offsetWidth;
      x = Math.min(x, Math.max(EDGE, width - size - EDGE));
      render();
    });
    resize.observe(stage);

    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    visibility.observe(stage);
    document.addEventListener('visibilitychange', sync);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
      document.removeEventListener('visibilitychange', sync);
      mover.style.transform = '';
      flip.style.transform = '';
    };
  }, [reduced]);

  return (
    <div
      ref={stageRef}
      className="relative h-[200px] overflow-hidden rounded-[16px] bg-item [--buddy:72px] md:h-[280px] md:[--buddy:96px]"
    >
      <div
        role="img"
        aria-label={reduced ? '가만히 서 있는 고양이 버디' : '고양이 버디가 화면 위를 천천히 왔다 갔다 걷는 모습'}
        className="absolute inset-0"
      />
      <div
        ref={moverRef}
        className="absolute top-1/2 mt-[calc(var(--buddy)/-2)] will-change-transform"
        style={reduced ? {left: '50%', marginLeft: 'calc(var(--buddy) / -2)'} : {left: 0}}
      >
        <button
          type="button"
          aria-label="버디 누르기. 폴짝 뛰어요"
          disabled={reduced}
          className={`block rounded-[16px] border-0 bg-transparent p-0 ${jumping ? 'buddy-jump' : ''}`}
          onClick={() => setJumping(true)}
          onAnimationEnd={() => setJumping(false)}
        >
          <span ref={flipRef} className="block">
            <span ref={bobRef} className="buddy-bob block" data-idle="true">
              <img
                src={twemojiSrc(DEMO_BUDDY.code)}
                width={96}
                height={96}
                alt=""
                aria-hidden="true"
                decoding="async"
                draggable={false}
                className="size-[var(--buddy)] select-none"
              />
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
