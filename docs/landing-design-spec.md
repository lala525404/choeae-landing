# 랜딩페이지 디자인 지시서 (추가 규칙)
> **참고**: 이 문서는 이전 스크롤형 랜딩의 디자인 규칙이에요. Tailwind·lucide는 3D 바탕화면 랜딩(`docs/landing-3d-impl.md`)에서 쓰지 않아요. 색 토큰 값과 버튼·글자 위계 원칙은 그대로 이어져요.

**기준은 앱 지시서를 그대로 따른다:** `C:\Users\user\Downloads\nyang-pet-app\docs\ui-redesign-spec.md` (맨 아래 "추가 결정"·"미리보기 OK 후 결정" 포함).
색 · 폰트(Pretendard, 박다현체는 로고만) · 모서리(16/10/999) · 1겹 · 포인트 색 1개 · 선 아이콘(lucide 1.5px) · AI 티 금지 목록 · 다크 수치는 재해석하지 않는다. 토큰 값은 `design-preview.html`의 `.f-root` 변수를 그대로 옮긴다.
아래는 **랜딩에만 필요한 추가 규칙**이다. 원칙: 페이지는 절제하고, 버디가 움직이거나 이모지가 터지는 데모 순간만 경쾌하게.

## 1. 토큰 · 색 (랜딩 한정 결정)
- 페이지 바탕 = 앱 "창 바탕" (#F4F4F4 / 다크 #0F0F10). 면이 필요한 곳만 패널(#FFF / #18181A) + 1px 테두리. 패널 안 면은 항목 면(#F4F4F4 / #222225)까지만, 그 안에 또 상자 금지.
- 보조 글자: 라이트 #6B6B6B (흰 면 5.3:1, #F4F4F4 면 4.9:1). 다크 #8E8E93 유지 — #18181A 5.4:1, #222225 4.9:1 이라 4.5:1 통과. 더 밝게 바꾸지 않는다.
- 포인트 #2563EB(다크 #3B82F6)는 링크(#1D4ED8 / #7DB0FF), 포커스 링, 선택된 탭 표시에만. 링크는 밑줄 + 오프셋 3px.
- 포커스 링: 2px 포인트색, 오프셋 2px, 애니메이션 없이 즉시.
- 토큰은 `src/index.css`의 `:root` / `[data-theme="dark"]` 변수 + Tailwind v4 `@theme inline`로 연결. 인라인 hex·`purple-*`·`indigo-*`·`stone-*` 클래스 금지.
- 삭제: 그라디언트 글자/버튼/배경, blur 원형 장식, 격자 배경, `shadow-subtle-*`, `glowing-active-border`, `backdrop-blur`, 이모지 아이콘, Plus Jakarta·Space Grotesk·JetBrains Mono, Google Fonts `@import`(현재 2번 중복).

## 2. 글자 (앱 대비 확대, 랜딩 전용)
| 용도 | 모바일 | 768px~ | 1024px~ | 줄 수 |
|---|---|---|---|---|
| 히어로 제목 (제품명) | 32px / 1.2 / 700 | 44px | 56px | 1줄 (넘치면 최대 2줄, `text-wrap: balance`) |
| 히어로 한 줄 설명 | 16px / 1.6 | 18px | 18px | 2줄 이하 |
| 섹션 제목 | 26px / 1.25 / 700 | 30px | 32px | 2줄 이하 |
| 소제목 | 16px / 700 | 16px | 18px | 1줄 |
| 본문 | 15px / 1.65 | 16px | 16px | — |
| 라벨·캡션 | 13px 보조색 | 13px | 13px | — |
- 자간 제목 -0.02em, 본문 0. 숫자는 `tabular-nums`. 이탤릭 금지(제목·본문 모두).
- 본문 최대 폭 **60ch (약 560px)**. 제목 최대 폭 18em. FAQ·설치·업데이트 단일 컬럼은 **720px**.
- 섹션 제목 위 대문자 영문 태그(`CORE FEATURES` 류), 섹션 번호 금지.
- 폰트는 앱과 같이 자체 호스팅: Pretendard Variable woff2(`font-display: swap`, 본문 폰트만 preload 1개). 박다현체는 로고 글자("최애를 풀어놨습니다")만 서브셋 woff2 (≤10KB). CDN 폰트 전부 제거.

## 3. 간격 · 그리드 · 브레이크포인트
- 브레이크포인트(모바일 우선): 640 / 768 / 1024 / 1280. 컨테이너 최대 **1120px**, 좌우 여백 20px(모바일) / 32px(768~).
- 인접 섹션 사이 간격 **72px(모바일) / 120px(1024~)**. 구현은 섹션에 `padding-block` 36px / 60px씩(위·아래 각각)으로 맞춘다. 앱의 32~40px보다 넓은 건 스크롤 페이지라서.
- 제목 → 내용 24px(모바일) / 32px(PC). 섹션 안 요소 간격 12px(앱 규칙 유지), 그룹 간 24px.
- 그리드: 모바일 1열, 768~ 6열, 1024~ 12열, gap 16/24px. 이미지 트랙은 `minmax(0, 1fr)`만 사용.
- 가운데 정렬은 푸터·마지막 CTA 한 줄 외 금지. 예외(2026-10-21 승인): 기능 섹션의 동물 8종 목록, 퇴근 알림 체험 영역(안내 문구·카드 문구). 히어로는 좌 7 / 우 5 비대칭, 모바일은 텍스트 → 스테이지 세로.
- 가로 스크롤 금지 (`html, body { overflow-x: clip }`, `hidden` 아님). 320/375/414/768px 확인. 두 줄로 꺾이는 버튼·내비 링크 금지.
- 터치 영역 최소 44px (버튼 높이 48px, 아이콘 버튼 44×44, FAQ 요약 줄 56px).

## 4. 이미지(스크린샷) 규격
- 실제 앱 캡처만 사용. 가짜 브라우저 바·창 틀·기기 프레임 그리기 금지. 1px 테두리(--line) + 모서리 16px만.
- 캡처 대상 3종: ① 홈(설정 칩 + 점심·퇴근 카드, 900×700 창) ② 사진 자르기 창 ③ 퇴근 알림.
- 2x 캡처 → 표시 폭 최대 720px(PC) / 100%(모바일), 원본 폭 **1170px 이상**(2026-10-21 기준 변경: 현재 캡처 1170px 유지, 다시 찍지 않는다), **webp** (lossy q80, 알파 필요 시 lossless 대신 q85+alpha). PNG/JPG 원본은 저장소에 넣지 않는다.
- 용량: 스크린샷 1장 **≤150KB**, 페이지 이미지 합계 **≤600KB**(버디 SVG 제외). OG 이미지만 예외로 **PNG 또는 JPG 1200×630, ≤300KB** (크롤러 호환).
- 라이트/다크 캡처 둘 다 만든다(6장). 같은 위치에 `<img>` 2개를 두고 `[data-theme]`로 한쪽만 `display: none` — 둘 다 `loading="lazy"`라 숨은 쪽은 받지 않는다.
- 모든 `<img>`에 `width`·`height`(레이아웃 밀림 방지), 한국어 `alt`(무엇이 보이는지), `decoding="async"`. 첫 화면(히어로)에는 스크린샷을 쓰지 않으므로 `loading="eager"` 대상 없음 — 나머지 전부 `loading="lazy"`.
- 버디 이미지: 앱과 같은 Twemoji SVG(앱에서 쓰는 것만, 동물 8종 + 데모 이모지 15종 + 하트류), `public/twemoji/`. 푸터에 출처 표기 필수: "버디 이미지: Twemoji © Twitter, Inc. and other contributors · CC BY 4.0" (https://creativecommons.org/licenses/by/4.0/ 링크).
- 이모지 글자(텍스트)로 버디·아이콘을 그리지 않는다. 버튼·메뉴·라벨은 lucide 선 아이콘. 이모지는 데모 폭발 연출에서만 Twemoji 이미지로.

## 5. 데모 애니메이션 규칙
공통: `transform`·`opacity`만 애니메이션. 이징 `cubic-bezier(0.23, 1, 0.32, 1)`(앱 `--f-ease-out`). UI 요소 전환 ≤160ms, 스크롤 등장(fade-in-on-scroll)·호버 들썩임·카드 hover lift 전부 사용 안 함.

**버디 걷기 (히어로 스테이지)**
- 스테이지: 패널 안 항목 면(#F4F4F4), 모서리 16px, 높이 200px(모바일) / 280px(PC). 그림자·바닥 장식 없음.
- 버디 크기 72px(모바일) / 96px(PC), Twemoji SVG(고양이). 좌↔우 왕복, 속도 약 40px/s, 끝에서 0.4초 멈춘 뒤 `scaleX(-1)`로 방향 전환. 걸음은 세로 bob 4px / 0.6s.
- 눌러보기: 버디 클릭/탭 시 120ms 점프(-16px) 1회. 이모지 파티클 없음(폭발은 체험 섹션 전용).
- 화면 밖(`IntersectionObserver`)이거나 탭이 숨겨지면(`visibilitychange`) 일시정지. 동시에 움직이는 버디 1마리.
- 스테이지에 `role="img"` + 설명 `aria-label`, 버디 자체는 `aria-hidden`, 클릭 대상은 키보드 포커스 가능한 버튼으로.

**퇴근 알림 이모지 체험 (버튼 1개)**
- 영역: 패널 높이 320px(모바일) / 420px(PC), `overflow: hidden`. 전체화면 점유 금지(페이지 안에서만).
- 버튼 "퇴근 알림 눌러보기" (회색 면 버튼, Bell 선 아이콘). 클릭 → 영역 안에서 앱 퇴근 알림과 같은 연출 재생, 총 2.6초 후 정리, 재생 중 재클릭은 무시(버튼 `aria-disabled`).
- 카드: 흰 면(다크 #18181A), 모서리 16px, 옅은 그림자 + blur 12px 허용(알림 예외 규칙). 현재 선택 버디 이미지 120px 크게, 등장 280ms, 스케일 0.92 → 1.04 → 1 (오버슈트 4% 이내), "오후 6:00 퇴근 시간이에요" 형식 시각.
- 이모지: 앱 퇴근 목록 15종 그대로(🏃✨🎉🎊🚀🌟💨🙌🔥⚡🥳🎆🍾🌈💃, Twemoji SVG). 아래에서 위로 솟음. 개수 `min(30, floor(영역폭/30) + 16)`, 지연 0~500ms, 지속 1.1~1.8s, 크기 28~60px(앱 40~87px의 약 70%), 도달 높이 55~90%, 좌우 드리프트 ±30px, 마지막 20% 구간에서 opacity 0.
- 동시 파티클 상한 30. 파티클 노드는 종료 후 제거.

**움직임 줄이기 (`prefers-reduced-motion: reduce`)**
- 버디 걷기 정지: 스테이지 중앙에 정지 이미지, bob·점프 없음.
- 체험 버튼: 솟는 이동 없이 이모지 15개를 고정 위치에 opacity 0 → 1 → 0, 600ms. 카드는 오버슈트 없이 opacity 160ms.
- 그 외 모든 전환은 opacity ≤150ms.

## 6. 다크 모드
- 앱과 같이 `html[data-theme="light"|"dark"]` 기준. 헤더 버튼 순환: 라이트 → 다크 → 시스템. 버튼 선택이 시스템 설정보다 우선, `localStorage`에 `choeae-theme`(light/dark/system) 저장.
- 깜빡임 방지: `index.html` `<head>`에 인라인 스크립트(gtag 아래)로 렌더 전에 `data-theme`를 해석값(light/dark)으로 설정. `system`이면 `matchMedia` 변경을 구독.
- Tailwind v4: `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))`. 기존 `.dark` 클래스 방식 제거. `color-scheme`을 테마별로 지정.
- 아이콘 버튼 44×44, 현재 상태를 `aria-label`로 알림(예: "화면 테마: 시스템, 누르면 라이트"). 아이콘 Sun / Moon / Monitor(선).

## 7. 버튼 위계 (채운 버튼 1개 원칙의 랜딩 적용)
- **한 번에 보이는 화면(뷰포트)에 채운 검정(다크는 흰색) 버튼은 최대 1개.** 페이지 전체로는 히어로와 마지막 다운로드 2곳이며 둘은 같은 동작.
- 히어로·마지막 다운로드: 접속 OS에 맞는 쪽이 채운 버튼(기본 Windows, UA가 macOS면 macOS), 다른 쪽은 회색 면 버튼(#EFEFEF / #26262A). 크기 동일 높이 48px, 알약 999px, 라벨 "Windows용 다운로드 v1.0.9" / "macOS용 다운로드 v1.0.8".
- 모바일 기기(iOS/Android) 접속: 채운 버튼 없이 둘 다 회색 + "컴퓨터에서 받아 주세요" 한 줄.
- 헤더 "다운로드": 항상 회색 알약(헤더는 모든 뷰포트에 같이 보이므로).
- 체험 버튼, 설치 탭, "이전 버전 더 보기": 회색 면 버튼 / 앱 세그먼트(회색 트랙 + 선택 흰 알약). 설치 섹션의 파일 받기와 FAQ 안 이동은 포인트색 텍스트 링크.
- 상태: hover 한 단계 진해짐(`#333` / `#E8E8E8`), `:active` scale 0.97 100ms, 호버는 `@media (hover: hover)`에서만, 포커스 링 항상 표시. 가짜 다운로드 진행 모달·시뮬레이션 삭제, 버튼은 실제 링크(`<a href download>`).

## 8. 사이트 주소 · 링크 단일 관리
- 사이트 주소는 `VITE_SITE_URL` 환경변수 1곳(`.env.example`에 키만 기재, 값은 도메인 확정 후). 코드·HTML에 도메인 문자열 하드코딩 금지.
- `index.html`: `<link rel="canonical" href="%VITE_SITE_URL%/">`, `og:url`, `og:image`(절대 URL, `%VITE_SITE_URL%/og.png`)를 Vite html 환경변수 치환으로 주입.
- `public/*.html` 정책 페이지: 토큰 `%SITE_URL%`만 쓰고 `vite.config.ts` 플러그인이 빌드 시 `dist`에서 치환. `sitemap.xml`·`robots.txt`도 같은 플러그인이 같은 값으로 생성(실제 존재하는 페이지만 나열).
- 값이 비어 있으면 canonical/og:url/sitemap을 **생략하고 경고만** 출력(임시 도메인을 박지 않는다).
- 다운로드 URL과 버전은 `src/constants.ts`의 `DOWNLOADS` 한 곳(Windows v1.0.9 `.exe`, macOS v1.0.8 `.dmg`). 버튼 라벨의 버전 숫자는 여기서 파생.
- 유지: `<html lang="ko">`(현재 `en`이라 수정 필요), gtag 스니펫, `<head>` 맨 위 AdSense TODO 주석.

## 9. 정적 페이지 (`public/*.html`)
- `privacy / terms / about / faq` 4개가 정본. `choeae-*.html` 4개는 같은 내용으로 보임 → 삭제 후보(리드 승인 후).
- 인라인 보라색·이모지 버튼·`© 2025`를 제거하고 같은 토큰을 쓰는 공용 `public/static.css` 1개로 통일, 다크 모드 동일 스크립트 적용, `© 2026`.

## 10. 확정 결정 (구성안 OK 후, 2026-10-20)
- 추가 결정(2026-10-21): 사이트 주소는 https://choeae-landing.vercel.app (Vercel Production/Preview/Development 모두), 브랜치 고정 주소는 쓰지 않는다. Vercel 미리보기 배포(VERCEL_ENV가 production이 아닌 경우)는 빌드 때 모든 HTML에 noindex 메타를 넣고 robots.txt를 Disallow로 만든다. 저작권자 표기는 "Lara Park"으로 통일. 개인정보처리방침·이용약관 시행일은 v1.1.0 배포일로 넣을 예정이라 YYYY-MM-DD 자리 표시만 둔다.
- 섹션 구성안 OK(히어로 → 앱 화면 → 기능 → 퇴근 알림 체험 → 설치 → 업데이트 → FAQ → 마지막 다운로드 → 푸터, 한 페이지 스크롤).
1. 개인정보처리방침: AdSense를 쓰지 않으므로 광고 관련 문구는 본문에서 뺀다. 실제로 쓰는 Google Analytics(gtag, 방문 통계 쿠키) 안내는 남긴다. 뺀 AdSense 문구는 HTML 주석으로 보관한다(도메인 연결 후 복구용).
2. 도메인: 아직 없음. 지금은 vercel.app 주소를 쓰고, `VITE_SITE_URL` 한 곳만 바꾸면 canonical·OG·sitemap·robots가 모두 바뀌게 한다.
3. macOS 표기: 버튼과 설치 안내에 "Apple Silicon(M1 이후) 전용"을 명확히. FAQ에 "인텔 맥은 아직 지원하지 않아요" 한 줄.
4. 업데이트 내역: v1.0.9까지만 정리. v1.1.0(새 디자인)은 배포 후 추가하므로 지금은 넣지 않는다. 근거 없는 내용은 쓰지 않는다.
5. 스크린샷(새 디자인, ui-redesign 브랜치 앱 실행 캡처): 홈(라이트), 홈(다크), 사진 자르기, 퇴근 알림, 미리 알림 토스트 — 5장. webp, 장당 150KB 이하.
6. 중복 페이지 `choeae-about/faq/privacy/terms.html` 삭제. 이미 검색에 잡혔을 수 있으므로 vercel.json에서 각각 `/about.html`, `/faq.html`, `/privacy.html`, `/terms.html`로 301 리다이렉트.

## 부록. 랜딩 3D 바탕화면 예외 (제안, 승인 전)
첫 화면 연출과 바탕화면 창 연출에 한해 "네모 안에 네모 금지, 플랫" 예외를 두는 안은 `docs/landing-3d-spec.md` 9절에 있다. 승인되기 전까지 이 문서의 규칙은 그대로다.
