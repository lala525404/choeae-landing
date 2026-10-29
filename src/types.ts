export type Platform = 'windows' | 'mac' | 'mobile';

export type ThemePref = 'light' | 'dark' | 'system';

export interface DownloadInfo {
  /** 버튼 라벨에 쓰는 OS 이름 */
  name: string;
  version: string;
  /** 다운로드 주소. DOWNLOADS_PAUSED가 켜져 있으면 빈 문자열이라 어디에도 렌더되지 않는다 */
  url: string;
  /** 받는 파일 이름(주소의 마지막 조각). 설치 안내 그림에 쓰므로 주소와 따로 둔다 */
  file: string;
  /** 받는 파일 형식 (카드에 표시) */
  ext: string;
  /** 파일 크기 표기(대략). 새 버전을 올리면 GitHub 릴리스의 파일 크기를 보고 같이 고친다 */
  size: string;
  /** 버튼 아래 작은 글씨 */
  note?: string;
}

export interface Buddy {
  id: string;
  name: string;
  /** public/twemoji 안의 파일 이름(확장자 제외) */
  code: string;
}

export interface Feature {
  title: string;
  text: string;
}

export interface InstallStep {
  title: string;
  text: string;
  /** 단계 안에 파일 받기 링크를 넣을 OS */
  download?: 'windows' | 'mac';
}

export interface ReleaseGroup {
  label?: string;
  items: string[];
}

export interface ReleaseNote {
  version: string;
  /** 릴리스 원문에 날짜가 있는 버전만 적는다 */
  date?: string;
  title?: string;
  latest?: boolean;
  /** true면 "이전 버전 더 보기"를 누르기 전까지 접어 둔다 */
  folded?: boolean;
  groups: ReleaseGroup[];
  /** 항목 아래에 보조색으로 붙이는 안내 */
  note?: string;
}

export interface FAQItem {
  question: string;
  /** 문단 배열. **굵게**와 [글자](주소) 표기를 쓸 수 있다 */
  answer: string[];
}
