// 앱 아이콘과 같은 하트(앱 저장소 assets/icon/heart.svg). 색은 currentColor라서 라이트/다크를 따른다.
const HEART_PATH =
  'M50 90 C47 90 44 88 41 86 C22 72 6 56 6 34 C6 18 18 8 31 8 C40 8 47 13 50 20 C53 13 60 8 69 8 C82 8 94 18 94 34 C94 56 78 72 59 86 C56 88 53 90 50 90 Z';

export function HeartMark({className = ''}: {className?: string}) {
  return (
    <svg className={`flex-none ${className}`} viewBox="6 8 88 82" fill="currentColor" aria-hidden="true" focusable="false">
      <path d={HEART_PATH} />
    </svg>
  );
}
