# 3D 바탕화면 랜딩 구현 메모 (`feature/landing-3d-impl`)

설계서는 `docs/landing-3d-spec.md`(결정과 이유)이고, 이 문서는 **코드가 어떻게 나뉘어 있는지**와 **바꿀 때 만지는 곳**만 적는다.

## 구조
```
index.html            머리: SEO 메타(그대로) + 첫 페인트 전 스크립트(data-theme, data-zone)
src/constants.ts      다운로드(버전·주소·크기·형식)·업데이트 기록·FAQ·기능·설치 단계 — 화면의 데이터는 모두 여기 한 곳
src/landing/
  Landing.tsx         루트. 마크업은 한 번만 그리고(상태 없음) 움직임은 engine이 입힌다
  sections.tsx        툴바·진행 표시·하트 무대·인트로·히어로·인덱스·카테고리 틀
  windows.tsx         카테고리 창 16개의 내용(도식·샘플 화면·타임라인·FAQ·개인정보 도식)
  parts.tsx           하트 SVG, 선 아이콘, 샘플 화면(미니) 컴포넌트
  landing.css         이 화면의 모든 스타일(색 토큰은 index.css, 인트로 구역의 다크 값은 여기)
  engine/             움직임(React 밖): core(설정·공통) pointer(하트 눈·펫·스파클) windows(창·탭)
                      extras(히어로 데모·인덱스·시스템 줄) intro(인트로·줌인·복귀) nav(진입 연출·이동·시작)
public/privacy.html   개인정보처리방침 전문. 화면의 요약 도식과 **시행일**(`vite.config.ts`가 이 파일에서 읽어 `__PRIVACY_DATE__`로 넣음)이 여기와 맞아야 한다
```

## 값을 바꾸는 곳
| 바꿀 것 | 위치 |
|---|---|
| 다운로드 버전·주소·크기·macOS "곧 나와요" | `src/constants.ts` `DOWNLOADS` (인트로·히어로 버튼 아래 글씨, 인덱스, 다운로드 카드, noscript가 모두 여기서 나옴) |
| 업데이트 기록 | `RELEASE_NOTES` (맨 위 항목에 `latest: true`) |
| 카테고리 재진입 연출(full/short/none) | `src/landing/engine/core.ts` `CONFIG.revisit` |
| 인트로 시간표, 줌인 길이 | 같은 파일 `CONFIG.intro`, `zoomMs`, `zoomFastMs` |
| 개인정보 요약 도식 | `windows.tsx` `Privacy` (privacy.html과 같은 뜻으로) |
| 카테고리 제목·한 줄 안내 | `sections.tsx` `CATS` (한 줄에 들어오는 길이로) |

## 동작 규칙(요약)
- 인트로: 다크 고정, 스크롤 잠금(html·body overflow), 문구 2.5초에 읽힘, 버튼 3.0초. 메인으로 가는 길은 줌인뿐(건너뛰기·Esc·"본문으로 건너뛰기"는 0.9초 빠른 줌인). "바로 다운받기"는 빠른 줌인 뒤 다운로드 화면에 도착(진행 숫자 숨김).
- 줌인·복귀·인트로에서의 이동은 `history.replaceState`라 뒤로 가기는 사이트를 떠난다. 인트로 다시 보기는 "처음으로".
- 재방문자(`localStorage choeae-intro=1`)와 직접 링크(`#download` 등)는 인트로 생략. `?intro=1`로 강제 재생, `?intro=0`으로 생략, `?slow=4`는 연출을 4배 느리게(검증용).
- 카테고리 창은 CSS 격자에 놓이고(겹치지 않음) 키가 모자라면 창 안에서 스크롤한다. 끌기는 `translate`라 레이아웃을 건드리지 않는다. 좁은 화면(≤1100px)은 세로로 쌓는다.
- 모든 글자는 처음부터 DOM에 있다(접힌 창 포함). 연출은 WAAPI `fill: 'backwards'`로만 시작 상태를 만든다. 움직임 줄이기는 샘플 화면이 정지 상태.
- `wheel`·`scroll` 가로채기 없음. (React가 루트에 passive wheel 위임 리스너 1쌍을 붙이는 것은 React 내부 동작이다.)

## 확인 방법
- `npm run lint` · `npm run build`
- 겹침·잘림: 화면마다 보이는 요소의 사각형을 모아 서로 겹치는지 보는 Playwright 스크립트로 1366×768, 1440×900, 1280×720, 1290×600, 1920×1080, 390×844를 확인했다(스크립트는 저장소에 넣지 않음).
- 글꼴: 화면에 나오는 모든 글자가 `public/fonts/PretendardVariable-subset.woff2`에 있는지 확인(`docs/release-checklist.md` 1단계). 새 글자가 생기면 앱 저장소 `node_modules\pretendard`의 원본에서 wght 400~700으로 다시 서브셋.

## 미리 그리기와 성능 메모
- **미리 그리기**: `vite-plugins/landing-shell.ts`가 빌드 때 `<App />`을 HTML로 그려 `index.html`의 `<!--LANDING_SHELL-->` 자리에 넣고, `main.tsx`가 `hydrateRoot`로 그 DOM에 붙는다(비어 있으면 `createRoot`). 그래서 JS가 오기 전에도 앱 이름·모든 카테고리 글자가 HTML에 있고, 첫 화면 요소(h1 등)가 다시 만들어지지 않는다. 플랫폼(Windows/macOS) 표기는 `usePlatform`이 붙은 뒤에 바뀐다. **컴포넌트에 `window`/`navigator`를 렌더 중에 읽는 코드를 넣지 말 것**(미리 그리기가 깨진다).
- 인트로 연출이 시작되기 전까지 `html[data-pre]`가 하트·문구·버튼을 투명하게 둔다(6초 안전장치). 앱 이름은 처음부터 보인다.
- 인트로는 `position: fixed` 층이다(문서 흐름은 히어로부터). 줌인·"처음으로"에서 아래 화면이 밀리지 않는다.
- 화면 밖 화면은 `content-visibility: auto`. 좁은 화면에서 `#features` 같은 직접 링크로 들어오면 그 방문에서는 끈다(`html[data-cvoff]`, 예상 높이와 실제 높이 차이로 화면이 밀리는 것을 막음). 데스크톱 히어로는 `100svh`로 고정(웹폰트 교체로 높이가 변해 아래 화면이 밀리는 것 방지).
- 모바일 Lighthouse는 운영 기준(약 77)과 비슷한 70대 후반이다. **Google Analytics(gtag) 스크립트를 막고 재면 구현 93~94 / 운영 91~95**라서, 점수를 가르는 것은 GA 로드다(LCP·TBT 모두). GA를 `load` 뒤 유휴 시간에 불러오면 올라갈 것으로 보이지만 통계 수집 시점이 바뀌어 결정이 필요하다.
