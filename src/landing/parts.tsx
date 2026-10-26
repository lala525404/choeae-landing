import type {CSSProperties, ReactNode} from 'react';
import {BUDDIES, LEAVE_EMOJI_CODES, twemojiSrc} from '../constants';

/** CSS 변수(--i 같은 값)를 style에 넘길 때 쓴다 */
export const cv = (vars: Record<string, string | number>) => vars as unknown as CSSProperties;

/** 등장 모션용 문구: 전체 문구가 처음부터 DOM에 있고(읽히고 검색됨), 글자마다 --i만 붙는다. 드러내는 건 landing.css의 .tyc 규칙이 한다. */
export function Typed({text}: {text: string}) {
  return (
    <>
      {[...text].map((c, i) =>
        c === ' ' ? (
          ' '
        ) : (
          <span className="tyc" key={i} style={cv({'--i': i})}>
            {c}
          </span>
        ),
      )}
    </>
  );
}

export const HEART_PATH =
  'M50 90 C47 90 44 88 41 86 C22 72 6 56 6 34 C6 18 18 8 31 8 C40 8 47 13 50 20 C53 13 60 8 69 8 C82 8 94 18 94 34 C94 56 78 72 59 86 C56 88 53 90 50 90 Z';

/** 하트 그라데이션·필터 정의. 한 번만 둔다 */
export function SvgDefs() {
  return (
    <svg width="0" height="0" style={{position: 'absolute'}} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="hg" x1="0" y1="8" x2="0" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{stopColor: 'var(--hg0)'}} />
          <stop offset=".5" style={{stopColor: 'var(--hg1)'}} />
          <stop offset=".78" style={{stopColor: 'var(--hg2)'}} />
          <stop offset="1" style={{stopColor: 'var(--hg3)'}} />
        </linearGradient>
        <radialGradient id="hp" cx="50%" cy="34%" r="70%">
          <stop offset="0" stopColor="#fff" stopOpacity=".24" />
          <stop offset=".45" stopColor="#fff" stopOpacity=".03" />
          <stop offset="1" stopColor="#000" stopOpacity=".62" />
        </radialGradient>
        <radialGradient id="hb" cx="66%" cy="80%" r="34%">
          <stop offset="0" stopColor="#fff" stopOpacity=".34" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hr" x1="8" y1="8" x2="92" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity=".95" />
          <stop offset=".35" stopColor="#fff" stopOpacity=".05" />
          <stop offset=".65" stopColor="#fff" stopOpacity=".06" />
          <stop offset="1" stopColor="#fff" stopOpacity=".85" />
        </linearGradient>
        <filter id="hf" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.6" />
        </filter>
        <filter id="hf2" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation=".7" />
        </filter>
        <clipPath id="hu">
          <path d={HEART_PATH} />
        </clipPath>
        <clipPath id="hc" clipPathUnits="objectBoundingBox">
          <path transform="scale(0.01)" d={HEART_PATH} />
        </clipPath>
      </defs>
    </svg>
  );
}

/** 작은 하트(툴바 로고·커서 펫·알림 카드): 광택까지 있는 가벼운 버전 */
export function HeartMini() {
  return (
    <svg viewBox="0 0 100 100" focusable="false" aria-hidden="true">
      <path className="hbase" d={HEART_PATH} />
      <g className="fx" clipPath="url(#hu)">
        <path d={HEART_PATH} fill="url(#hp)" style={{opacity: 'var(--hv)'}} />
        <ellipse cx="29" cy="24" rx="15" ry="8" transform="rotate(-28 29 24)" fill="#fff" opacity=".6" filter="url(#hf)" />
        <circle cx="21" cy="19" r="2.6" fill="#fff" />
        <path d={HEART_PATH} fill="none" stroke="url(#hr)" strokeWidth="4" style={{opacity: 'var(--hrim)'}} />
      </g>
      <g className="peyes">
        <g className="blink">
          <ellipse className="eye" cx="39" cy="43" rx="4.4" ry="8.4" />
          <ellipse className="eye" cx="61" cy="43" rx="4.4" ry="8.4" />
        </g>
      </g>
    </svg>
  );
}

/** 샘플 화면용 가장 가벼운 하트 */
export function HeartLite() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path className="hbase" d={HEART_PATH} />
      <ellipse className="fx" cx="29" cy="24" rx="14" ry="7" transform="rotate(-28 29 24)" fill="#fff" opacity=".5" />
      <g className="blink">
        <ellipse className="eye" cx="39" cy="43" rx="4.6" ry="8.6" />
        <ellipse className="eye" cx="61" cy="43" rx="4.6" ry="8.6" />
      </g>
    </svg>
  );
}

export const Hl = ({cls = ''}: {cls?: string}) => (
  <span className={`hl ${cls}`.trim()}>
    <HeartLite />
  </span>
);

/* 선 아이콘: 화면 위 글자는 모두 실제 텍스트 노드이고, 아이콘은 장식(aria-hidden)이다 */
const IC = {
  download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
  click: '<path d="m5 3 14 7-6 2-2 6z"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  sparkles: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2"/>',
  wrench: '<path d="M14 6a4 4 0 0 0 5 5l-9 9a2.1 2.1 0 0 1-3-3l9-9a4 4 0 0 0-2-2z"/>',
  arrowup: '<path d="M12 19V5m-6 6 6-6 6 6"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  cookie: '<circle cx="12" cy="12" r="9"/><path d="M9 10h.01M14 9h.01M10 15h.01M15 14h.01"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  laptop: '<rect x="5" y="5" width="14" height="10" rx="2"/><path d="M2 19h20"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="1.6"/><path d="m21 15-5-5L5 21"/>',
  ruler: '<path d="M3 17 17 3l4 4L7 21z"/><path d="M8 12l2 2M11 9l2 2M14 6l2 2"/>',
  storage:
    '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  eraser: '<path d="M5 19 19 5"/><path d="M14 4l1 3M18 8l3 1M3 12l3 1"/>',
  bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01"/>',
  gauge: '<path d="M4 18a9 9 0 1 1 16 0"/><path d="M12 14l4-4"/>',
  building: '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h.01M13 7h.01M9 11h.01M13 11h.01M10 21v-4h4v4"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  sliders: '<path d="M4 8h10M18 8h2M4 16h2M10 16h10"/><circle cx="16" cy="8" r="2"/><circle cx="8" cy="16" r="2"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  power: '<path d="M12 3v9"/><path d="M6.3 6.3a8 8 0 1 0 11.4 0"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  coffee: '<path d="M5 8h12v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5z"/><path d="M17 10h2a2 2 0 0 1 0 4h-2M8 3v2M12 3v2"/>',
  server: '<rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7h.01M7 17h.01"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
} as const;

export type IconName = keyof typeof IC;

export function Icon({n, cls = ''}: {n: IconName; cls?: string}) {
  return (
    <svg
      className={`ico ${cls}`.trim()}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{__html: IC[n]}}
    />
  );
}

/* ── 샘플 화면(미니): 패널 안에서 하트 버디가 걷고 알림이 뜬다. 운영 랜딩 히어로의 버디 스테이지와 같은 방식이지만
   rAF 대신 CSS 키프레임이라 가볍고, 화면 밖이면 멈춘다. 움직임 줄이기에서는 정지한 장면이다. ── */
export function Scn({label, cls = '', style, children}: {label: string; cls?: string; style?: CSSProperties; children: ReactNode}) {
  return (
    <div className={`mini ${cls}`.trim()} role="img" aria-label={label} style={style}>
      {children}
    </div>
  );
}

const buds = BUDDIES;

export function AnimalGrid() {
  return (
    <div className="m2g">
      {buds.map((b) => (
        <span key={b.id}>
          <img src={twemojiSrc(b.code)} alt="" width="40" height="40" loading="lazy" />
        </span>
      ))}
      <i />
    </div>
  );
}

export function SceneInstall({file}: {file: string}) {
  return (
    <Scn label="설치 파일을 더블클릭하면 앱 창이 열리는 모습">
      <div className="m1f">
        <Icon n="download" />
        <span className="ftxt">{file}</span>
      </div>
      <span className="m1c">
        <Icon n="click" />
      </span>
      <i className="m1r" />
      <div className="m1w">
        <Hl />
        <b />
      </div>
    </Scn>
  );
}

export function ScenePick() {
  return (
    <Scn label="설정창에서 동물을 고르거나 내 사진을 올리는 모습">
      <AnimalGrid />
      <span className="m2b">
        <Icon n="image" />
        <span>내 사진 올리기</span>
      </span>
    </Scn>
  );
}

export function SceneRun() {
  return (
    <Scn label="버디가 바탕화면 위를 돌아다니며 말풍선을 띄우는 모습">
      <div className="mwin">
        <i />
        <i />
        <i />
      </div>
      <div className="m3b">
        <span className="m3f">
          <Hl cls="bob" />
        </span>
      </div>
      <span className="m3t">오늘 점심은 뭐예요?</span>
    </Scn>
  );
}

export function SceneTray({cls = ''}: {cls?: string}) {
  return (
    <Scn label="트레이 아이콘을 우클릭하면 설정 열기·버디 부르기·보이기·숨기기·앱 종료 메뉴가 열리는 모습" cls={cls}>
      <div className="f8m">
        {['설정 열기', '버디 부르기', '버디 보이기', '버디 숨기기', '앱 종료'].map((t, i) => (
          <span key={t} style={cv({'--i': i})}>
            {t}
          </span>
        ))}
      </div>
      <div className="f8t">
        <Hl />
      </div>
    </Scn>
  );
}

/** 기능 카드: [제목, 한 줄, 장면] */
export const FEATURE_CARDS: {title: string; line: string; scene: ReactNode}[] = [
  {
    title: '사진 로테이션',
    line: '사진을 여러 장 올리면 정한 주기로 번갈아 보여줘요.',
    scene: (
      <Scn label="사진(예시: 동물 그림)이 정한 주기로 번갈아 보이는 모습">
        <div className="f1f">
          {[0, 1, 2].map((i) => (
            <img key={i} style={cv({'--i': i})} src={twemojiSrc(buds[i].code)} alt="" width="40" height="40" loading="lazy" />
          ))}
        </div>
        <div className="f1d">
          {[0, 1, 2].map((i) => (
            <i key={i} style={cv({'--i': i})} />
          ))}
        </div>
      </Scn>
    ),
  },
  {
    title: '말풍선 시계',
    line: '시간대에 맞춰 한마디씩 해요.',
    scene: (
      <Scn label="시간대에 맞춰 말풍선 문구가 바뀌는 모습">
        <div className="f2c">
          {['오전 9:00', '낮 12:00', '오후 6:00'].map((t, i) => (
            <span key={t} style={cv({'--i': i})}>
              {t}
            </span>
          ))}
        </div>
        <div className="f2b">
          {['굿모닝이에요!', '점심시간이에요!', '퇴근 시간이에요!'].map((t, i) => (
            <span key={t} style={cv({'--i': i})}>
              {t}
            </span>
          ))}
        </div>
        <Hl cls="f2h bob" />
      </Scn>
    ),
  },
  {
    title: '점심·퇴근 알림',
    line: '정한 시각에 카드와 이모지가 떠요.',
    scene: (
      <Scn label="퇴근 시각에 알림 카드와 이모지가 올라오는 모습">
        <div className="f3c">
          <Hl />
          <b>오후 6:00 퇴근 시간이에요</b>
        </div>
        {LEAVE_EMOJI_CODES.slice(0, 6).map((c, i) => (
          <img
            key={c}
            className="f3e"
            style={{left: `${10 + i * 15}%`, ...cv({'--dl': `${(i * 0.35).toFixed(2)}s`})}}
            src={twemojiSrc(c)}
            alt=""
            width="16"
            height="16"
            loading="lazy"
          />
        ))}
      </Scn>
    ),
  },
  {
    title: '동물 친구 8종',
    line: '사진이 없어도 괜찮아요.',
    scene: (
      <Scn label="동물 8종 중에서 고르는 모습">
        <AnimalGrid />
      </Scn>
    ),
  },
  {
    title: '활동 모드 3단계',
    line: 'Chill·Buddy·Chaos로 움직임을 골라요.',
    scene: (
      <Scn label="활동 모드마다 버디가 움직이는 정도가 다른 모습">
        <div className="f5w">
          {[
            ['Chill', 'c'],
            ['Buddy', 'b'],
            ['Chaos', 'x'],
          ].map(([name, k]) => (
            <div className="f5l" key={name}>
              <em>{name}</em>
              <span className={`f5m ${k}`}>
                <Hl />
              </span>
            </div>
          ))}
        </div>
      </Scn>
    ),
  },
  {
    title: '4분할 활동 구역',
    line: '한 칸에서만 돌아다니게 해요.',
    scene: (
      <Scn label="화면을 네 칸으로 나눠 한 칸에서만 돌아다니는 모습">
        <div className="f6g">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="f6h">
          <Hl />
        </div>
      </Scn>
    ),
  },
  {
    title: '화면 테마',
    line: '라이트·다크·시스템 중에서 골라요.',
    scene: (
      <>
        <Scn
          label="라이트·다크·시스템 테마가 바뀌는 모습"
          style={cv({'--wall': '#E6E9EF', '--wall2': '#D9DEE8', '--panel': '#fff', '--line': '#E4E4E4', '--line2': '#C9C9CE'})}
        >
          <div className="f7w">
            <i />
            <i />
            <i />
          </div>
          <div className="f7d">
            <div className="f7w">
              <i />
              <i />
              <i />
            </div>
          </div>
        </Scn>
        <div className="f7t">
          {['라이트', '다크', '시스템'].map((t, i) => (
            <em key={t} style={cv({'--i': i})}>
              {t}
            </em>
          ))}
        </div>
      </>
    ),
  },
  {
    title: '트레이 메뉴',
    line: '트레이에서 버디를 부르고 숨기고 끌 수 있어요.',
    scene: <SceneTray />,
  },
];
