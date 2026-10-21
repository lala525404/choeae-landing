# 릴리스 체크리스트 (앱 새 버전 → 랜딩 배포)

앱 저장소(`nyang-pet-app`)에서 새 버전의 GitHub 릴리스를 올린 뒤, 랜딩(`choeae-landing`)에 반영하는 순서예요.
기준: 앱 저장소 `release\RELEASE_NOTES_v<버전>.md`. 마지막으로 이 순서대로 진행한 버전은 **v1.1.1 (Windows, 2026-10-21)**이에요.

## 0. 시작 전 (앱 쪽)
- [ ] 앱 `main`에 머지돼 있고, 태그 `v<버전>`이 그 커밋을 가리켜요. (`git ls-remote --tags origin v<버전>`)
- [ ] GitHub 릴리스가 공개(Published) 상태예요. Latest 표시도 확인해요.
- [ ] 첨부 파일 이름과 크기를 적어 둬요. 예) `choeae-app-1.1.1.exe` 73,220,291 bytes
- [ ] 다운로드 주소가 열리는지 확인해요. 주소 형식: `https://github.com/lala525404/nyang-pet-app/releases/download/v<버전>/<파일 이름>`
  - `curl -sIL <주소>`에서 마지막 `HTTP/1.1 200`과 `Content-Length`가 파일 크기와 같아야 해요.

## 1. 랜딩 수정 (`redesign` 브랜치에서)
다운로드 버전과 주소는 **`src/constants.ts`의 `DOWNLOADS` 한 곳**만 고쳐요. 버튼 라벨, 설치 안내, 업데이트 내역 머리 안내, noscript 요약이 여기서 나와요.
- [ ] `DOWNLOADS.windows`의 `version`, `url`
- [ ] `RELEASE_NOTES` 맨 위에 새 버전 항목 추가. 앱의 `RELEASE_NOTES_v<버전>.md`를 그대로 옮겨요(SmartScreen 안내 문단과 백틱만 뺌).
  - 이전 버전의 `latest: true`를 지우고 새 버전에만 붙여요. 날짜는 `YYYY.MM.DD`.
  - 항목의 `**굵게**` 표기는 `Updates.tsx`가 그대로 보여 줘요.
- [ ] 같은 내용을 `docs/landing-copy.md` 7장에도 남겨요.
- [ ] 개인정보처리방침·이용약관 시행일(`public/privacy.html`, `public/terms.html`의 `시행일:`)을 바꿀 일이 있으면 바꿔요. 내용이 바뀌지 않았다면 그대로 둬요.
- [ ] 새 문구의 글자가 Pretendard 서브셋에 있는지 확인해요. 빠지면 그 글자만 다른 글꼴로 보여요.
  - 확인: 소스의 모든 글자가 `public/fonts/PretendardVariable-subset.woff2`의 cmap에 있는지 (fontTools).
  - 없으면 앱 저장소 `node_modules\pretendard`의 원본 가변 폰트에서 wght 400~700, 기존 글자 + 새 글자로 다시 서브셋해요.
- [ ] 파비콘·로고를 바꿨다면 앱 저장소 `assets/icon/landing-favicon.svg`를 `public/favicon.svg`로 복사하고, PNG 폴백(`favicon-32.png`, `icon-192.png`, `apple-touch-icon.png`)은 앱의 `scripts/build-icons.py` 함수로 다시 만들어요(애플 터치 아이콘만 흰 바탕).

## 2. 로컬 확인
- [ ] `npm run lint`
- [ ] `VITE_SITE_URL=https://choeae-landing.vercel.app npm run build` (값이 비면 canonical·og·sitemap이 빠져요)
- [ ] `dist/index.html`에 canonical, og:url, og:image가 있고, `dist/sitemap.xml`에 5개 페이지, `dist/robots.txt`에 `Allow: /`와 `Sitemap:` 줄이 있어요.
  - `VERCEL_ENV=preview`로 빌드하면 모든 HTML에 noindex가 붙고 robots가 `Disallow: /`가 돼요(미리보기 전용). 운영 빌드에서는 없어야 해요.
- [ ] 화면 확인: 히어로·마지막 다운로드 버튼 라벨(`Windows용 다운로드 v…`), 맥 버튼 아래 안내, 설치 탭, 업데이트 내역 맨 위(최신 배지 1개), 헤더·푸터 하트 로고, 375px·1280px에서 가로 스크롤 없음.
- [ ] 링크 확인: 페이지 안의 모든 외부 링크가 200이고 `#top #features #install #updates #faq #download` 대상이 있어요.

## 3. 커밋·머지·배포
- [ ] `redesign`에 커밋하고 push해요(Vercel 미리보기 배포는 noindex).
- [ ] `git fetch` 후 `main`이 `redesign`의 조상인지 확인해요: `git merge-base --is-ancestor origin/main origin/redesign`
- [ ] `git checkout main && git merge --ff-only redesign && git push origin main` → Vercel 운영 배포가 시작돼요.
- [ ] 배포가 끝날 때까지 기다려요: `https://api.github.com/repos/lala525404/choeae-landing/commits/<sha>/status`의 `state`가 `success`.

## 4. 운영 배포 확인 (`https://choeae-landing.vercel.app`)
- [ ] `/`가 200이고 새 버전 라벨, 새 업데이트 항목이 보여요.
- [ ] `<meta name="robots" content="noindex…">`가 **없어요**(운영). canonical이 운영 주소예요.
- [ ] `/robots.txt`에 `Allow: /`, `Sitemap:` 줄. `/sitemap.xml`이 열려요.
- [ ] `/favicon.svg`가 새 하트(`prefers-color-scheme` 포함)이고 `/favicon-32.png`, `/icon-192.png`, `/apple-touch-icon.png`가 열려요.
- [ ] 정책 페이지 4개(`/privacy.html /terms.html /about.html /faq.html`)가 200. 시행일 표기.
- [ ] 옛 주소 `/choeae-about.html` 등 4개가 `301`로 새 주소에 가요.
- [ ] 다운로드 버튼 주소가 열려요(0단계와 같은 방법).

## 5. macOS dmg를 같은 릴리스에 올릴 때 바꿀 곳 (오늘 밤 예정)
앱 GitHub 릴리스 v1.1.1을 **Edit**해서 dmg를 첨부해요. 새 릴리스·새 태그를 만들지 않아요. 파일 이름은 `choeae-app-1.1.1-arm64.dmg`(앱 `package.json`의 dmg `artifactName` 기준)인지 올린 뒤 확인해요.

랜딩에서 바꿀 곳:
- [ ] **`src/constants.ts` → `DOWNLOADS.mac`**
  - `version: '1.0.8'` → `'1.1.1'`
  - `url` → `https://github.com/lala525404/nyang-pet-app/releases/download/v1.1.1/choeae-app-1.1.1-arm64.dmg` (v1.0.8의 `-1.0.0-arm64.dmg`처럼 이름이 이상하지 않은지 실제 에셋 이름으로 확인)
  - `soon: '새 디자인 버전은 곧 나와요'` 줄 **삭제**(없으면 맥 버튼 아래 안내가 사라져요)
- [ ] **`src/components/Install.tsx`** 맥 탭 아래 `macOS용 새 디자인 버전(v…)은 준비 중이에요…` 문단 **삭제**(주석 "macOS가 Windows보다 늦는 동안만 쓰는 안내"로 표시돼 있어요).
- [ ] **`src/components/AppScreens.tsx`** `intro`: `아래는 Windows v1.1.1의 설정창이에요. macOS는 새 디자인 버전이 곧 나와요.` → `아래는 v1.1.1의 설정창이에요.`
- [ ] **`src/constants.ts` → `RELEASE_NOTES`의 v1.1.1 `note`** 맨 아래 줄 `macOS 버전은 곧 추가됩니다.` → `macOS: choeae-app-1.1.1-arm64.dmg (Apple Silicon 전용)` 처럼 다운로드 안내로.
  - 앱 GitHub 릴리스 본문도 같은 줄로 바꿔요(`release\RELEASE_NOTES_v1.1.1.md`).
  - v1.1.0 항목의 같은 줄은 그 버전 당시 기록이라 그대로 둬도 돼요.
- [ ] **`public/privacy.html`** `TODO(macOS 새 디자인 버전을 올린 뒤 삭제)` 아래의 "Twemoji를 jsDelivr에서 불러온다"는 문단을 삭제해요. 맥도 앱 안에 담긴 버전이 되면 더는 사실이 아니에요. (이전 Windows 버전 링크가 남아 있지 않은지도 확인)
- [ ] **`docs/landing-copy.md`** 3장·6장·7장·13장의 맥 관련 문구를 같은 내용으로 맞춰요.
- [ ] 자동으로 바뀌는 곳(확인만): 히어로·마지막 다운로드의 `macOS용 다운로드 v…`, 설치 탭 `macOS용 파일 받기 v…`, 업데이트 내역 머리 안내 `Windows는 v…, macOS는 v…까지 받을 수 있어요.`, noscript 요약.
- [ ] 그다음 2~4단계를 다시 해요. 특히 맥 다운로드 주소가 200이고 `Content-Length`가 올린 dmg 크기와 같은지 확인해요.

## 6. 열려 있는 확인 사항
- `public/privacy.html`: 호스팅(Vercel) 방문 기록 처리 안내를 넣을지 정해야 해요(주석 TODO).
- Google signals는 꺼짐, Buy Me a Coffee는 씀으로 확정했어요(2026-10-21). 바뀌면 개인정보처리방침을 같이 고쳐요.
- OG 이미지(`public/og.png`)에 옛 화면이 들어 있다면 새 디자인으로 바꿀지 확인해요.
