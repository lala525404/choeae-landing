export type Platform = 'windows' | 'mac' | 'mobile';

export type ThemePref = 'light' | 'dark' | 'system';

export interface DownloadInfo {
  /** 버튼 라벨에 쓰는 OS 이름 */
  name: string;
  version: string;
  url: string;
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
  date: string;
  title?: string;
  latest?: boolean;
  /** true면 "이전 버전 더 보기"를 누르기 전까지 접어 둔다 */
  folded?: boolean;
  groups: ReleaseGroup[];
}

export interface FAQItem {
  question: string;
  /** 문단 배열. **굵게**와 [글자](주소) 표기를 쓸 수 있다 */
  answer: string[];
}
