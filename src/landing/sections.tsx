import {DOWNLOADS, DOWNLOADS_PAUSED, LATEST_RELEASE, PRODUCT_NAME} from '../constants';
import {usePlatform} from '../hooks/usePlatform';
import {HEART_PATH, HeartMini, cv} from './parts';
import {ctaSub} from './intro';
import {Win, WINDOWS, type CatId} from './windows';

export const CATS: {id: CatId; title: string; sub: string}[] = [
  {id: 'start', title: '처음이신가요?', sub: '설치는 금방 끝나요. 사진 한 장만 준비하면 돼요.'},
  {id: 'features', title: '기능', sub: '내 사진이 버디가 되고, 하루가 조금 가벼워져요.'},
  {id: 'download', title: '다운로드', sub: '내 컴퓨터에 맞는 파일을 보여 드려요. 앱 안에는 광고가 없어요.'},
  {id: 'updates', title: '업데이트 기록', sub: '지금까지 나온 버전을 모았어요. 새 소식은 여기에 먼저 적을게요.'},
  {id: 'faq', title: 'FAQ', sub: '받기 전에 궁금한 것들을 모았어요. 못 찾으면 문의로 알려 주세요.'},
  {id: 'privacy', title: '개인정보처리방침', sub: '무엇을 모으고 무엇을 모으지 않는지 알려요. 전문은 별도 페이지에 있어요.'},
];

const pad = (n: number) => String(n).padStart(2, '0');

export function Toolbar() {
  return (
    <header id="bar" role="toolbar" aria-label="도구 모음">
      <a className="brand" href="#intro">
        <HeartMini />
        {PRODUCT_NAME}
      </a>
      <span className="sp" />
      <button className="tool" id="tTheme" type="button">
        <span className="l">라이트/다크</span>
        <span className="s">테마</span> <kbd>D</kbd>
      </button>
      <button className="tool" id="tReset" type="button">
        <span className="l">레이아웃 초기화</span>
        <span className="s">초기화</span> <kbd>L</kbd>
      </button>
      <button className="tool" id="t3d" type="button" aria-pressed="false">
        <span id="t3dl">3D 끄기</span>
      </button>
      <button className="tool" id="tPet" type="button" aria-pressed="false">
        <span className="l" id="tPetL">펫 따라오기 끄기</span>
        <span className="s" id="tPetS">펫 끄기</span>
      </button>
      <button className="tool" id="tKeys" type="button" aria-pressed="false">
        <span className="l" id="tKeysL">단축키 끄기</span>
        <span className="s" id="tKeysS">단축키</span>
      </button>
    </header>
  );
}

export function Progress() {
  return (
    <nav id="prog" aria-label="현재 위치">
      <span className="n" id="progn">
        01 / 06
      </span>
      <ul id="progl">
        {CATS.map((c, i) => (
          <li key={c.id}>
            <a href={`#${c.id}`} aria-label={`${pad(i + 1)} ${c.title}`} />
          </li>
        ))}
      </ul>
      <a className="back" href="#index">
        인덱스로
      </a>
    </nav>
  );
}

/** 큰 하트(눈이 마우스를 따라간다). 화면마다 자리를 옮기는 고정 무대 */
export function Stage() {
  return (
    <div id="stage" className="jump">
      <div id="zoomer">
        <div id="glow" />
        <div id="hshadow">
          <i />
        </div>
        <div id="float">
          <div id="heart" role="img" aria-label="눈이 마우스를 따라가는 하트">
            <div id="tilt">
              <svg viewBox="0 0 100 100" focusable="false" aria-hidden="true">
                <path className="hbase" d={HEART_PATH} />
                <g className="fx" clipPath="url(#hu)">
                  <path d={HEART_PATH} fill="url(#hp)" style={{opacity: 'var(--hv)'}} />
                  <g id="bounce">
                    <path d={HEART_PATH} fill="url(#hb)" />
                  </g>
                  <g id="spec" style={{opacity: 'var(--hspec)'}}>
                    <ellipse cx="29" cy="24" rx="17" ry="9.5" transform="rotate(-28 29 24)" fill="#fff" opacity=".55" filter="url(#hf)" />
                    <ellipse cx="25" cy="21" rx="7" ry="3.2" transform="rotate(-28 25 21)" fill="#fff" opacity=".9" filter="url(#hf2)" />
                    <ellipse cx="71" cy="22" rx="8" ry="3.6" transform="rotate(26 71 22)" fill="#fff" opacity=".28" filter="url(#hf2)" />
                    <circle cx="19" cy="18.5" r="1.7" fill="#fff" />
                  </g>
                  <path d={HEART_PATH} fill="none" stroke="url(#hr)" strokeWidth="3" style={{opacity: 'var(--hrim)'}} />
                </g>
                <g id="look">
                  <g className="blink">
                    <ellipse className="eye" cx="39" cy="43" rx="3.6" ry="7.6" />
                    <ellipse className="eye" cx="61" cy="43" rx="3.6" ry="7.6" />
                  </g>
                </g>
              </svg>
              <div className="hn" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const HERO_FEATS: {icon: string; title: string; text: string}[] = [
  {icon: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="1.6"/><path d="m21 15-5-5L5 21"/>', title: '사진 한 장이 버디가 돼요', text: '최애·반려동물 사진을 올리면 화면 위를 돌아다녀요.'},
  {icon: '<path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-5.4A8 8 0 1 1 21 12Z"/>', title: '시간대에 맞춰 한마디씩 해요', text: '출근·점심·퇴근마다 말풍선을 띄워요.'},
  {icon: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>', title: '점심·퇴근 알림을 챙겨 줘요', text: '정한 시각에 카드와 이모지가 화면에 떠요.'},
];

/** 1. 히어로: 무슨 앱인지 + 받는 법 + 라이브 데모 */
export function Hero() {
  const platform = usePlatform();
  return (
    <section id="hero" className="screen" aria-labelledby="h-hero">
      <div>
        <div className="hslot" data-slot />
        <p className="eyebrow" id="eyebrow">
          데스크톱 펫 앱 · Windows / macOS · 무료
        </p>
        <h2 className="hero-h" id="h-hero">
          최애를 모니터 위에 풀어놓는 데스크톱 펫
        </h2>
        <p className="lead">좋아하는 사진이 버디가 되어 내 화면 위를 돌아다녀요. 점심·퇴근 시간엔 알림도 챙겨 줘요.</p>
        <div className="cta">
          {DOWNLOADS_PAUSED ? (
            <span className="btn main off" role="note">
              <span>다운로드 잠시 멈춤</span>
              <small>곧 다시 열게요</small>
            </span>
          ) : (
            <a className="btn main" href="#download" data-instant data-look data-avoid data-fx>
              <span>바로 다운받기</span>
              <small>{ctaSub(platform)}</small>
            </a>
          )}
          <a className="btn" href="#start" data-look data-fx>
            3단계 사용법 보기
          </a>
        </div>
        <p className="trust">
          <span>
            앱 이름 <b>{PRODUCT_NAME}</b>
          </span>
          <span>Windows · macOS(Apple Silicon)</span>
          <span>무료 · 앱 안 광고 없음</span>
        </p>
      </div>
      <div>
        <div
          className="mon"
          id="mon"
          role="img"
          aria-label="앱 동작 예시. 하트 버디가 화면 위를 돌아다니며 말풍선을 띄우고, 점심·퇴근 시간에는 알림 카드와 이모지가 올라옵니다."
        >
          <div className="mon-badge" aria-hidden="true">
            예시 화면 · 실제 앱 동작과 같은 모습
          </div>
          <div className="mon-scr" aria-hidden="true" id="monscr">
            <div className="fakewin">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="bubble" id="bubble" />
            <div className="buddy" id="buddy">
              <HeartMini />
            </div>
            <div className="notif" id="notif">
              <HeartMini />
              <b id="nt">점심시간이에요</b>
              <span className="ns" id="ns">
                낮 12:00
              </span>
            </div>
          </div>
          <div className="mon-bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span className="clk" id="clk">
              오전 11:40
            </span>
          </div>
        </div>
        <ul className="feats" aria-label="핵심 기능">
          {HERO_FEATS.map((f) => (
            <li key={f.title}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{__html: f.icon}} />
              <div>
                <b>{f.title}</b>
                <span>{f.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <a className="cue" href="#index">
        <span>스크롤하면 인덱스</span>
        <i />
      </a>
    </section>
  );
}

/** 2. 인덱스(마인드맵): 노드는 실제 링크라서 키보드와 검색엔진이 그대로 따라간다 */
export function IndexMap() {
  const {windows, mac} = DOWNLOADS;
  const latest = LATEST_RELEASE();
  const desc: Record<CatId, string> = {
    start: '3단계로 시작해요',
    features: '사진 버디 · 말풍선 · 알림',
    download: DOWNLOADS_PAUSED ? '지금은 잠시 멈췄어요' : `Windows v${windows.version} · macOS v${mac.version}`,
    updates: latest ? `${latest.version}이 최신이에요` : '지금까지 나온 버전',
    faq: '자주 묻는 질문',
    privacy: '무엇을 모으고 안 모으는지',
  };
  const pos: Record<CatId, [number, number]> = {
    start: [31, 33],
    features: [78, 26],
    download: [13, 54],
    updates: [87, 54],
    faq: [25, 82],
    privacy: [75, 82],
  };
  return (
    <section id="index" className="screen" aria-labelledby="h-index">
      <div className="idx-head">
        <h2 id="h-index">인덱스</h2>
        <p>가고 싶은 곳을 누르거나, 그대로 스크롤하면 순서대로 이어져요.</p>
        <a className="btn" id="toIntro" href="#intro">
          처음으로
        </a>
      </div>
      <nav className="map" id="map" aria-label="카테고리 인덱스">
        <svg className="lines" id="lines" aria-hidden="true" />
        <div className="mapc" data-slot />
        <ol>
          {CATS.map((c, i) => (
            <li key={c.id}>
              <a className="node" href={`#${c.id}`} style={cv({'--x': pos[c.id][0], '--y': pos[c.id][1]})} data-look data-fx>
                <span className="k">{pad(i + 1)}</span>
                <b>{c.title}</b>
                <span className="d">{desc[c.id]}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </section>
  );
}

/** 3~8. 카테고리: 제목 블록 + 창(격자 두 열) */
export function Category({index}: {index: number}) {
  const cat = CATS[index];
  const wins = WINDOWS.filter((w) => w.sec === cat.id);
  const cols = [0, 1] as const;
  return (
    <section id={cat.id} className="screen cat" aria-labelledby={`h-${cat.id}`}>
      <div className="hd">
        <div className="hd-t">
          <p className="pgn">
            {pad(index + 1)} / {pad(CATS.length)}
          </p>
          <h2 id={`h-${cat.id}`}>{cat.title}</h2>
        </div>
        <p className="hd-sub" {...(cat.id === 'features' ? {id: 'scr', 'data-text': cat.sub} : {})}>
          {cat.sub}
        </p>
        <a className="btn small to-index" href="#index">
          인덱스로
        </a>
      </div>
      <div className="sec-actions">
        {wins.map((w) => (
          <button key={w.id} type="button" className="reopen" data-for={w.id} hidden>
            {w.title} 창 열기
          </button>
        ))}
      </div>
      <div className="wins">
        {cols.map((c) => (
          <div className="col" key={c}>
            {wins
              .filter((w) => w.col === c)
              .map((w) => (
                <Win key={w.id} def={w} />
              ))}
          </div>
        ))}
      </div>
    </section>
  );
}
