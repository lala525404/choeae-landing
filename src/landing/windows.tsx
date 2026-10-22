import type {ReactNode} from 'react';
import {
  CONTACT_HREF,
  DOWNLOADS,
  FAQ_ITEMS,
  FEATURE_LIST,
  PHOTO_TIPS,
  RELEASE_NOTES,
  SCREEN_FEATURES,
  MAC_STEPS,
  WINDOWS_STEPS,
  downloadLabel,
  fileLinkLabel,
  fileName,
  type DownloadOS,
} from '../constants';
import {usePlatform} from '../hooks/usePlatform';
import {RichText} from '../lib/RichText';
import type {FAQItem, InstallStep, Platform, ReleaseNote} from '../types';
import {FEATURE_CARDS, Icon, SceneInstall, ScenePick, SceneRun, SceneTray, cv, type IconName} from './parts';

declare const __PRIVACY_DATE__: string;

export type CatId = 'start' | 'features' | 'download' | 'updates' | 'faq' | 'privacy';

export interface WinDef {
  id: string;
  sec: CatId;
  col: 0 | 1;
  title: string;
  /** 창 본문의 최대 높이(없으면 화면 높이에 맞춰 줄어든다) */
  mh?: string;
  collapsed?: boolean;
  body: ReactNode;
}

const Steps = ({items}: {items: InstallStep[]}) => (
  <ol className="steps">
    {items.map((step, i) => (
      <li key={step.title}>
        <span className="no">{i + 1}</span>
        <div>
          <b>{step.title}</b>
          <span className="sub">
            <RichText text={step.text} />
          </span>
          {step.download && (
            <a className="link-a" style={{display: 'inline-block', marginTop: 4, fontSize: 14}} href={DOWNLOADS[step.download].url} download>
              {fileLinkLabel(step.download)}
            </a>
          )}
        </div>
      </li>
    ))}
  </ol>
);

const Faq = ({item, open = false, extra}: {item: FAQItem; open?: boolean; extra?: ReactNode}) => (
  <details open={open}>
    <summary>{item.question}</summary>
    {item.answer.map((a, i) => (
      <p key={i}>
        <RichText text={a} />
      </p>
    ))}
    {extra}
  </details>
);

const Tabs = ({id, labels, panels}: {id: string; labels: string[]; panels: ReactNode[]}) => (
  <>
    <div className="seg" role="tablist" aria-label={id === 'ins' ? '설치 방법 고르기' : '화면 고르기'}>
      {labels.map((l, i) => (
        <button
          key={l}
          type="button"
          role="tab"
          id={`${id}-t${i}`}
          aria-selected={i === 0}
          aria-controls={`${id}-p${i}`}
          tabIndex={i === 0 ? 0 : -1}
        >
          {l}
        </button>
      ))}
    </div>
    {panels.map((p, i) => (
      <div key={i} role="tabpanel" id={`${id}-p${i}`} aria-labelledby={`${id}-t${i}`} hidden={i !== 0}>
        {p}
      </div>
    ))}
  </>
);

/* ── 1. 처음이신가요? ── */
function StartSteps() {
  return (
    <>
      <ol className="steps3">
        <li className="sc">
          <div className="sh">
            <span className="n">1</span>
            <h4>설치</h4>
          </div>
          <SceneInstall file={fileName('windows')} />
          <p>받은 파일을 더블클릭해요. 설치 없이 바로 실행돼요.</p>
        </li>
        <li className="sc">
          <div className="sh">
            <span className="n">2</span>
            <h4>버디 고르기</h4>
          </div>
          <ScenePick />
          <p>설정창에서 동물 8종 중에 고르거나 내 사진을 올려요.</p>
        </li>
        <li className="sc">
          <div className="sh">
            <span className="n">3</span>
            <h4>풀어놓기</h4>
          </div>
          <SceneRun />
          <p>버디가 화면 위를 돌아다니고 한마디씩 해요.</p>
        </li>
      </ol>
      <p className="sub" style={{marginTop: 12}}>
        "Windows의 PC 보호" 창이 뜨면 <b>추가 정보</b> → <b>실행</b>을 눌러요. 처음 받는 앱에는 이 창이 뜰 수 있어요.
      </p>
    </>
  );
}

const faqBy = (re: RegExp) => FAQ_ITEMS.filter((i) => re.test(i.question));

function StartDetail() {
  return (
    <>
      <Tabs id="ins" labels={['Windows', 'macOS']} panels={[<Steps items={WINDOWS_STEPS} />, <Steps items={MAC_STEPS} />]} />
      <p className="sub" style={{marginTop: 12}}>
        내 컴퓨터에 맞는 쪽이 먼저 열려요.
      </p>
      <div className="gl">켠 다음에는</div>
      {faqBy(/사라졌어요|숨기거나/).map((i) => (
        <Faq key={i.question} item={i} />
      ))}
    </>
  );
}

const TIP_ICONS: IconName[] = ['image', 'ruler', 'storage', 'eraser'];

function PhotoTips() {
  return (
    <>
      <p className="sub" style={{marginBottom: 8}}>
        올릴 때 원형이나 사각형으로 자를 수 있고, 자른 모양 그대로 나와요.
      </p>
      <ul className="tips">
        {PHOTO_TIPS.map((t, i) => (
          <li key={t}>
            <Icon n={TIP_ICONS[i] ?? 'image'} />
            <span>{t}</span>
          </li>
        ))}
      </ul>
      <p className="sub" style={{marginTop: 10}}>
        <a className="link-a" href="https://www.remove.bg" target="_blank" rel="noopener noreferrer">
          remove.bg에서 배경 지우기
        </a>{' '}
        (새 창)
      </p>
    </>
  );
}

/* ── 2. 기능 ── */
function FeatureCards() {
  return (
    <div className="fgrid">
      {FEATURE_CARDS.map((c) => (
        <div className="fc hold" tabIndex={0} key={c.title}>
          {c.scene}
          <h4>{c.title}</h4>
          <p>{c.line}</p>
        </div>
      ))}
    </div>
  );
}

function Shots() {
  return (
    <Tabs
      id="scr"
      labels={['홈', '자르기', '퇴근 알림', '미리 알림']}
      panels={[
        <>
          <img className="shot th-l" src="/screens/home-light.webp" width="1170" height="910" loading="lazy" alt="최애를 풀어놨습니다 설정창 홈 화면" />
          <img className="shot th-d" src="/screens/home-dark.webp" width="1170" height="910" loading="lazy" alt="최애를 풀어놨습니다 설정창 홈 화면(다크)" />
          <p className="cap">
            {SCREEN_FEATURES.map((f) => (
              <span key={f.title}>
                <b>{f.title}</b> {f.text}{' '}
              </span>
            ))}
          </p>
        </>,
        <>
          <img className="shot" src="/screens/crop.webp" width="1170" height="910" loading="lazy" alt="올린 사진을 원형 틀에 맞춰 자르는 창. 확대와 위치 조절, 원형·사각형 선택이 보여요." />
          <p className="cap">내 사진은 원하는 모양으로 잘라서 올려요.</p>
        </>,
        <>
          <img className="shot" src="/screens/alert-leave.webp" width="1170" height="910" loading="lazy" alt="화면 가운데에 버디와 퇴근 시각이 적힌 카드가 뜨고 주변에 이모지가 올라오는 모습" />
          <p className="cap">정한 시각에 퇴근 알림이 화면에 떠요.</p>
        </>,
        <>
          <img className="shot" style={{maxWidth: 240}} src="/screens/toast.webp" width="380" height="380" loading="lazy" alt="고양이 버디 위에 종 아이콘과 퇴근 5분 전이에요라고 적힌 작은 알림이 떠 있는 모습" />
          <p className="cap">퇴근 몇 분 전에 버디 위로 작은 알림이 먼저 떠요.</p>
        </>,
      ]}
    />
  );
}

/* ── 3. 다운로드 ── */
const platformLabel = (p: Platform) => (p === 'mac' ? 'macOS' : p === 'mobile' ? '휴대폰·태블릿' : 'Windows');

function OsCard({os, primary}: {os: DownloadOS; primary: boolean}) {
  const d = DOWNLOADS[os];
  const note = 'note' in d && d.note ? d.note : '';
  return (
    <div className="osc">
      <div className="osh">
        <Icon n={os === 'windows' ? 'monitor' : 'laptop'} />
        <b>{d.name}</b>
        <span className="chip ok">
          <Icon n="check" />
          받을 수 있어요
        </span>
      </div>
      <p className="ver">v{d.version}</p>
      <p className="sub">
        {d.ext} · {d.size}
        {note ? ` · ${note}` : ''}
      </p>
      <a className={primary ? 'dl' : 'dl gray'} href={d.url} download data-avoid>
        {downloadLabel(os)}
      </a>
    </div>
  );
}

function OsWindow() {
  const platform = usePlatform();
  return (
    <>
      <p className="sub" style={{marginBottom: 8}}>
        감지된 환경: {platformLabel(platform)}
        {platform === 'mobile' ? ' · 컴퓨터에서 받아 주세요' : ''}
      </p>
      <div className="oscards">
        <OsCard os="windows" primary={platform !== 'mac' && platform !== 'mobile'} />
        <OsCard os="mac" primary={platform === 'mac'} />
      </div>
      <div className="gl">설치는 이렇게</div>
      <ol className="flow">
        <li>
          <span className="ic">
            <Icon n="download" />
          </span>
          받기
        </li>
        <li className="ar" aria-hidden="true">
          →
        </li>
        <li>
          <span className="ic">
            <Icon n="click" />
          </span>
          더블클릭
          <br />
          설치 없이 실행
        </li>
        <li className="ar" aria-hidden="true">
          →
        </li>
        <li>
          <span className="ic">
            <Icon n="shield" />
          </span>
          보안 안내
          <br />
          추가 정보 → 실행
        </li>
        <li className="ar" aria-hidden="true">
          →
        </li>
        <li>
          <span className="ic">
            <Icon n="heart" />
          </span>
          버디 등장
        </li>
      </ol>
      <p className="sub" style={{marginTop: 10}}>
        macOS는 .dmg를 열고 앱을 응용 프로그램 폴더로 끌어 놓아요. <b>무료</b>이고 앱 안에는 광고가 없어요.
      </p>
      <div className="gl">다 받았다면</div>
      <div className="links" style={{marginTop: 0}}>
        <a href="#start">3단계 사용법 보기</a>
        <a href="#index">인덱스로</a>
      </div>
    </>
  );
}

function SmartFigure() {
  return (
    <div className="smart" role="img" aria-label="PC 보호 창에서 추가 정보를 누른 뒤 실행을 누르는 순서">
      <div className="sd">
        <b>Windows의 PC 보호</b>
        <span className="sl">추가 정보</span>
        <span className="sb">실행</span>
      </div>
    </div>
  );
}

/* ── 4. 업데이트 기록: 세로 타임라인 + 변화 아이콘. 상세는 선택하면 펼친다(닫힌 상태에서도 DOM에 있다) ── */
type Kind = 'sparkles' | 'arrowup' | 'wrench';
const kindOf = (label?: string): Kind => (/새로/.test(label ?? '') ? 'sparkles' : /좋아/.test(label ?? '') ? 'arrowup' : 'wrench');
const KIND_LABEL: Record<Kind, string> = {sparkles: '새로 생겼어요', arrowup: '좋아졌어요', wrench: '고쳤어요'};

function Release({note, open}: {note: ReleaseNote; open: boolean}) {
  const count: Record<Kind, number> = {sparkles: 0, arrowup: 0, wrench: 0};
  note.groups.forEach((g) => {
    count[kindOf(g.label)] += g.items.length;
  });
  return (
    <details className={`tv${note.latest ? ' latest' : ''}`} open={open}>
      <summary>
        <b>{note.version}</b>
        <span className="d">{note.date ?? ''}</span>
        <span className="t">{note.title ?? ''}</span>
        <span className="cs">
          {(Object.keys(count) as Kind[])
            .filter((k) => count[k])
            .map((k) => (
              <span className="chip" key={k} title={KIND_LABEL[k]}>
                <Icon n={k} />
                {count[k]}
                <span className="sr">{KIND_LABEL[k]}</span>
              </span>
            ))}
        </span>
      </summary>
      <div className="tvb">
        {note.groups.map((g, gi) => (
          <div key={gi}>
            {g.label && <div className="gl">{g.label}</div>}
            <ul className="ul2">
              {g.items.map((x) => (
                <li key={x}>
                  <RichText text={x} />
                </li>
              ))}
            </ul>
          </div>
        ))}
        {note.note && <p className="sub pre">{note.note}</p>}
      </div>
    </details>
  );
}

function Timeline() {
  return (
    <div className="tlv">
      {RELEASE_NOTES.map((n, i) => (
        <Release key={n.version} note={n} open={i === 0} />
      ))}
    </div>
  );
}

function Legend() {
  return (
    <>
      <ul className="legend">
        {(Object.keys(KIND_LABEL) as Kind[]).map((k) => (
          <li key={k}>
            <span className="chip">
              <Icon n={k} />
            </span>
            {KIND_LABEL[k]}
          </li>
        ))}
      </ul>
      <p className="sub" style={{marginTop: 10}}>
        버전을 누르면 바뀐 점이 펼쳐져요. 아이콘 옆 숫자는 항목 수예요.
      </p>
    </>
  );
}

/* ── 5. FAQ: 질문마다 아이콘, 답변은 짧게 + 필요한 곳에 작은 그림 ── */
const FAQ_ICONS: [RegExp, IconName][] = [
  [/무료/, 'check'],
  [/사진도/, 'image'],
  [/저장/, 'lock'],
  [/회사/, 'building'],
  [/느려/, 'gauge'],
  [/Windows에서 보안/, 'shield'],
  [/확인되지/, 'laptop'],
  [/인텔/, 'cpu'],
  [/모드/, 'sliders'],
  [/사라졌/, 'eye'],
  [/숨기거나/, 'power'],
];
const faqIcon = (q: string): IconName => FAQ_ICONS.find(([r]) => r.test(q))?.[1] ?? 'help';

function FaqRich({item, open}: {item: FAQItem; open: boolean}) {
  const q = item.question;
  return (
    <details className="fq" open={open}>
      <summary>
        <span className="fi">
          <Icon n={faqIcon(q)} />
        </span>
        {q}
      </summary>
      {item.answer.map((a, i) => (
        <p key={i}>
          <RichText text={a} />
        </p>
      ))}
      {/Windows에서 보안/.test(q) && <SmartFigure />}
      {/모드/.test(q) && (
        <div className="modes">
          <span className="chip">
            <Icon n="sliders" />
            Chill 거의 안 움직여요
          </span>
          <span className="chip">Buddy 가끔 움직여요</span>
          <span className="chip">Chaos 빠르게 날아다녀요</span>
        </div>
      )}
      {/사라졌/.test(q) && <SceneTray cls="s" />}
    </details>
  );
}

const isContact = (i: FAQItem) => /문의/.test(i.question);

function FaqList() {
  return (
    <>
      {FAQ_ITEMS.filter((i) => !isContact(i)).map((i, k) => (
        <FaqRich key={i.question} item={i} open={k === 0} />
      ))}
    </>
  );
}

function Contact() {
  const q = FAQ_ITEMS.find(isContact);
  return (
    <>
      {q && (
        <>
          <p>
            <b>{q.question}</b>
          </p>
          <p className="sub" style={{margin: '6px 0 8px'}}>
            {q.answer.map((a, i) => (
              <RichText key={i} text={a} />
            ))}
          </p>
        </>
      )}
      <div className="links" style={{marginTop: 0}}>
        <a href={CONTACT_HREF} style={{gap: 8}}>
          <Icon n="mail" />
          메일 쓰기
        </a>
      </div>
    </>
  );
}

/* ── 6. 개인정보처리방침: 모으는 것 / 안 모으는 것 도식. 문구는 public/privacy.html과 같은 뜻으로 맞춘 요약이다 ── */
const Row = ({icon, children, small, no}: {icon: IconName; children: ReactNode; small?: ReactNode; no?: boolean}) => (
  <div className={`pvr${no ? ' no' : ''}`}>
    <Icon n={icon} />
    <span>
      {children}
      {small && <small>{small}</small>}
    </span>
  </div>
);

function Privacy() {
  return (
    <>
      <div className="pv">
        <div className="pvp">
          <h4>
            <Icon n="monitor" />앱(내 컴퓨터)
          </h4>
          <Row icon="lock" small="버디 종류, 모드, 크기, 활동 구역, 알림 시각, 올린 사진이 여기에 해당해요.">
            설정값과 올린 사진은 내 컴퓨터에만 저장돼요
          </Row>
          <Row icon="check">개발자는 사용자의 정보를 받지 않아요</Row>
          <Row icon="check">앱 안에는 광고가 없어요</Row>
          <Row icon="image" small="이때 해당 서비스에 접속 기록이 남을 수 있어요.">
            버디 이미지(Twemoji)는 외부 이미지 서비스(jsDelivr)에서 불러와요
          </Row>
        </div>
        <div className="pva" aria-hidden="true">
          <i />
          <Icon n="lock" />
          <i />
        </div>
        <div className="pvp">
          <h4>
            <Icon n="globe" />이 사이트
          </h4>
          <Row
            icon="chart"
            small="방문한 페이지, 머문 시간, 브라우저 종류, 운영체제, 기기 종류, 접속 지역(국가·도시 수준), 접속 경로를 Google Analytics로 수집해요. 쿠키를 차단하거나 차단 부가기능을 쓰면 막을 수 있어요."
          >
            방문 통계
          </Row>
          <Row icon="download" small="다운로드 버튼을 누르면 GitHub Releases에서 파일을 받아요. GitHub의 개인정보처리방침이 적용돼요.">
            앱 다운로드
          </Row>
          <Row icon="server" small="이 사이트는 Vercel에서 호스팅돼요. 접속 시 IP 주소 등 접속 기록이 서버 로그에 기록될 수 있어요.">
            호스팅 접속 기록
          </Row>
          <Row icon="coffee" small="개발자 후원 서비스">
            Buy Me a Coffee
          </Row>
          <Row icon="x" no>
            이름이나 이메일처럼 개인을 직접 알아볼 수 있는 정보는 수집하지 않아요
          </Row>
        </div>
      </div>
      <p className="sub" style={{marginTop: 10}}>
        시행일: {__PRIVACY_DATE__}. 이 그림은 요약이고, 기준은{' '}
        <a className="link-a" href="/privacy.html">
          개인정보처리방침 전문
        </a>
        이에요.
      </p>
    </>
  );
}

function MoreLinks() {
  return (
    <>
      <div className="links" style={{flexDirection: 'column', gap: 8, marginTop: 0}}>
        <a href="/privacy.html">개인정보처리방침 전문</a>
        <a href="/terms.html">이용약관</a>
        <a href="/about.html">서비스 소개</a>
        <a href="/faq.html">FAQ 전체 보기</a>
        <a href={CONTACT_HREF}>문의하기</a>
      </div>
      <p className="sub" style={{marginTop: 14}}>
        버디 이미지: Twemoji © Twitter, Inc. and other contributors ·{' '}
        <a className="link-a" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
          CC BY 4.0
        </a>
      </p>
      <p className="sub">© 2026 Lara Park</p>
    </>
  );
}

const featureMore = (
  <ul className="flist">
    {FEATURE_LIST.map((f) => (
      <li key={f.title}>
        <b>{f.title}</b>
        <span>{f.text}</span>
      </li>
    ))}
  </ul>
);

export const WINDOWS: WinDef[] = [
  {id: 'w-steps', sec: 'start', col: 0, title: '3단계로 시작해요', body: <StartSteps />},
  {id: 'w-detail', sec: 'start', col: 0, title: '설치 자세히 (Windows / macOS)', collapsed: true, mh: '220px', body: <StartDetail />},
  {id: 'w-tips', sec: 'start', col: 1, title: '사진 준비 팁', body: <PhotoTips />},
  {
    id: 'w-tray',
    sec: 'start',
    col: 1,
    title: '켠 다음에는',
    body: (
      <>
        <SceneTray cls="s" />
        <p className="cap">트레이 아이콘을 우클릭하면 설정 열기, 버디 부르기, 보이기, 숨기기, 앱 종료를 고를 수 있어요.</p>
      </>
    ),
  },
  {id: 'w-cards', sec: 'features', col: 0, title: '이렇게 움직여요', body: <FeatureCards />},
  {id: 'w-shots', sec: 'features', col: 1, title: '실제 앱 화면', body: <Shots />},
  {id: 'w-more', sec: 'features', col: 1, title: '기능 자세히 보기', collapsed: true, mh: '220px', body: featureMore},
  {id: 'w-os', sec: 'download', col: 0, title: '내 컴퓨터에 맞는 파일', body: <OsWindow />},
  {
    id: 'w-smart',
    sec: 'download',
    col: 1,
    title: '받은 뒤 보안 안내가 뜨면',
    body: (
      <>
        <SmartFigure />
        {faqBy(/Windows에서 보안|확인되지|인텔/).map((i, k) => (
          <Faq key={i.question} item={i} open={k === 0} />
        ))}
      </>
    ),
  },
  {id: 'w-tl', sec: 'updates', col: 0, title: '업데이트 내역', body: <Timeline />},
  {id: 'w-legend', sec: 'updates', col: 1, title: '변화 종류', body: <Legend />},
  {id: 'w-faq', sec: 'faq', col: 0, title: '자주 묻는 질문', body: <FaqList />},
  {id: 'w-contact', sec: 'faq', col: 1, title: '문의하기', body: <Contact />},
  {id: 'w-pv', sec: 'privacy', col: 0, title: '수집하는 것과 안 하는 것', body: <Privacy />},
  {id: 'w-links', sec: 'privacy', col: 1, title: '더 알아보기', body: <MoreLinks />},
];

export function Win({def}: {def: WinDef}) {
  const {id, title, collapsed, mh, body} = def;
  return (
    <section
      className="win"
      id={id}
      aria-labelledby={`${id}-h`}
      style={mh ? cv({'--mh': mh}) : undefined}
      {...(collapsed ? {'data-collapsed': ''} : {})}
      data-start-collapsed={collapsed ? '' : undefined}
    >
      <div className="tb" tabIndex={0} aria-label={`${title} 창 제목줄. Alt+방향키로 이동`}>
        <span className="grip" aria-hidden="true" />
        <h3 id={`${id}-h`}>{title}</h3>
        <button
          className="ib"
          type="button"
          data-act="fold"
          aria-label={collapsed ? '펼치기' : '접기'}
          aria-expanded={!collapsed}
        >
          {collapsed ? '+' : '−'}
        </button>
        <button className="ib" type="button" data-act="close" aria-label="닫기">
          ×
        </button>
      </div>
      <div className="bodywrap">
        <div className="body">
          <div>{body}</div>
        </div>
      </div>
    </section>
  );
}
