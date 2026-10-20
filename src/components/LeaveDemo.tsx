import {Bell} from 'lucide-react';
import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {DEMO_BUDDY, LEAVE_EMOJI_CODES, twemojiSrc} from '../constants';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {preloadImages} from '../lib/preload';
import {Section} from './Section';

const TOTAL_MS = 2600;
const MAX_PARTICLES = 30;

interface Particle {
  key: string;
  code: string;
  style: CSSProperties;
}

interface Run {
  id: number;
  still: boolean;
  particles: Particle[];
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** 앱 퇴근 알림과 같은 연출: 아래에서 위로 솟는 이모지(앱 크기의 약 70%). 영역 안에서만 재생한다. */
function createRising(width: number, height: number): Particle[] {
  const count = Math.min(MAX_PARTICLES, Math.floor(width / 30) + 16);
  const start = Math.floor(Math.random() * LEAVE_EMOJI_CODES.length);
  return Array.from({length: count}, (_, index) => {
    const size = Math.round(rand(28, 60));
    return {
      key: `p${index}`,
      code: LEAVE_EMOJI_CODES[(start + index) % LEAVE_EMOJI_CODES.length],
      style: {
        left: Math.round(rand(0, Math.max(0, width - size))),
        '--size': `${size}px`,
        '--delay': `${Math.round(rand(0, 500))}ms`,
        '--dur': `${Math.round(rand(1100, 1800))}ms`,
        '--dy': `${Math.round(height * rand(0.55, 0.9))}px`,
        '--drift': `${Math.round(rand(-30, 30))}px`,
      } as CSSProperties,
    };
  });
}

/** 움직임 줄이기: 이동 없이 15개를 고정 위치에서 나타났다 사라지게 한다. */
function createStill(width: number, height: number): Particle[] {
  const size = 44;
  const columns = 5;
  return LEAVE_EMOJI_CODES.map((code, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    return {
      key: `s${index}`,
      code,
      style: {
        left: Math.round(((col + 0.5) / columns) * width - size / 2),
        top: Math.round(((row + 0.5) / 3) * height - size / 2),
        '--size': `${size}px`,
      } as CSSProperties,
    };
  });
}

export function LeaveDemo() {
  const reduced = useReducedMotion();
  const areaRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number>(0);
  const [run, setRun] = useState<Run | null>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // 섹션 가까이 오면 이모지 이미지를 미리 받아 첫 재생이 끊기지 않게 한다.
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        preloadImages([...LEAVE_EMOJI_CODES, DEMO_BUDDY.code].map(twemojiSrc));
        observer.disconnect();
      },
      {rootMargin: '600px 0px'},
    );
    observer.observe(area);
    return () => observer.disconnect();
  }, []);

  const play = () => {
    const area = areaRef.current;
    if (run || !area) return; // 재생 중 다시 눌러도 무시
    const {clientWidth: width, clientHeight: height} = area;
    setRun({
      id: Date.now(),
      still: reduced,
      particles: reduced ? createStill(width, height) : createRising(width, height),
    });
    timer.current = window.setTimeout(() => setRun(null), TOTAL_MS);
  };

  return (
    <Section id="demo" title="퇴근 알림, 미리 눌러봐요">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-6">
        <div className="flex flex-col gap-4 lg:col-span-5">
          <p className="t-body text-sub">
            앱에서는 정해 둔 퇴근 시각에 이모지가 올라와요. 아래 버튼으로 맛보기만 볼 수 있어요.
          </p>
          <div className="flex flex-col items-start gap-3">
            <button type="button" className="btn" aria-disabled={run !== null} onClick={play}>
              <Bell size={18} strokeWidth={1.5} aria-hidden="true" />
              퇴근 알림 눌러보기
            </button>
            <p role="status" className="t-caption min-h-[1.5em]">
              {run ? '알림이 나오는 중이에요' : ''}
            </p>
            {reduced && (
              <p className="t-caption">움직임 줄이기 설정을 켜 두셔서 이모지가 제자리에서 나타났다 사라져요.</p>
            )}
          </div>
        </div>

        <div
          ref={areaRef}
          role="group"
          aria-label="퇴근 알림 체험 영역. 버튼을 누르면 이모지가 아래에서 위로 올라가요"
          className="relative h-[320px] overflow-hidden rounded-[16px] border border-line bg-screen md:h-[420px] lg:col-span-7"
        >
          {!run && (
            <p className="absolute inset-0 grid place-items-center px-6 text-center text-[13px] text-on-screen">
              버튼을 누르면 이곳에 알림이 떠요
            </p>
          )}
          {run && (
            <>
              <div aria-hidden="true">
                {run.particles.map((particle) => (
                  <img
                    key={`${run.id}-${particle.key}`}
                    src={twemojiSrc(particle.code)}
                    width={60}
                    height={60}
                    alt=""
                    decoding="async"
                    data-still={run.still}
                    className="demo-particle"
                    style={particle.style}
                  />
                ))}
              </div>
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <div
                  data-still={run.still}
                  className="demo-card flex w-[min(240px,calc(100%-32px))] flex-col items-center gap-3 rounded-[16px] border border-line bg-panel px-5 py-6 shadow-toast"
                >
                  <img
                    src={twemojiSrc(DEMO_BUDDY.code)}
                    width={120}
                    height={120}
                    alt=""
                    aria-hidden="true"
                    className="size-[120px]"
                  />
                  <p className="num text-center text-[15px] font-semibold leading-snug text-ink">
                    오후 6:00 퇴근 시간이에요
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Section>
  );
}
