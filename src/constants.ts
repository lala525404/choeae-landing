import { BuddyConfig, ReleaseNote, FAQItem } from './types';

export const BUDDY_CHARACTERS: BuddyConfig[] = [
  {
    id: 'cat',
    name: '야옹이 🐱',
    emoji: '🐱',
    color: 'from-amber-400 to-orange-500',
    bgClass: 'bg-amber-100 dark:bg-amber-950/40',
    borderClass: 'border-amber-400 dark:border-amber-700',
    accentColor: '#f59e0b',
    description: '가장 기본적인 도망 마스터 버디. "일하냥?" 하면서 딴짓을 감시합니다.'
  },
  {
    id: 'dog',
    name: '멍멍이 🐶',
    emoji: '🐶',
    color: 'from-yellow-500 to-yellow-600',
    bgClass: 'bg-yellow-50 dark:bg-yellow-950/30',
    borderClass: 'border-yellow-500 dark:border-yellow-700',
    accentColor: '#eab308',
    description: '주인이 일하면 꼬리를 열심히 흔들며 파티클을 뿜는 적극형 파트너.'
  },
  {
    id: 'rabbit',
    name: '토깽이 🐰',
    emoji: '🐰',
    color: 'from-pink-400 to-pink-500',
    bgClass: 'bg-pink-100 dark:bg-pink-950/40',
    borderClass: 'border-pink-400 dark:border-pink-800',
    accentColor: '#ec4899',
    description: '폴짝폴짝 높은 속도를 자랑하며 가끔 기습 순간이동을 합니다.'
  },
  {
    id: 'fox',
    name: '여우 🦊',
    emoji: '🦊',
    color: 'from-orange-500 to-red-500',
    bgClass: 'bg-orange-100 dark:bg-orange-950/40',
    borderClass: 'border-orange-400 dark:border-orange-800',
    accentColor: '#f97316',
    description: '지혜롭게 주인님의 월급 루팡 시간을 실시간으로 칭찬해 줍니다.'
  },
  {
    id: 'hamster',
    name: '햄찌 🐹',
    emoji: '🐹',
    color: 'from-amber-300 to-yellow-400',
    bgClass: 'bg-amber-50 dark:bg-amber-950/20',
    borderClass: 'border-amber-300 dark:border-amber-800',
    accentColor: '#fbbf24',
    description: '구석에서 해바라기씨를 까며 벽 쿵 모션을 가장 자주 즐깁니다.'
  },
  {
    id: 'bear',
    name: '곰돌이 🐻',
    emoji: '🐻',
    color: 'from-amber-700 to-amber-900',
    bgClass: 'bg-amber-100/60 dark:bg-amber-950/50',
    borderClass: 'border-amber-700 dark:border-amber-900',
    accentColor: '#b45309',
    description: '낮잠 모션 "zzz"을 매우 좋아하며 움직임이 조금 느긋합니다.'
  },
  {
    id: 'penguin',
    name: '펭귄 🐧',
    emoji: '🐧',
    color: 'from-blue-400 to-sky-600',
    bgClass: 'bg-blue-100 dark:bg-blue-950/40',
    borderClass: 'border-blue-400 dark:border-blue-800',
    accentColor: '#3b82f6',
    description: '미끄러지듯 이동하여 작업표시줄 근처를 산책하는 냉방 대장.'
  },
  {
    id: 'duck',
    name: '꽉꽉이 🦆',
    emoji: '🦆',
    color: 'from-emerald-400 to-teal-500',
    bgClass: 'bg-emerald-100 dark:bg-emerald-950/30',
    borderClass: 'border-emerald-400 dark:border-emerald-800',
    accentColor: '#10b981',
    description: '엉뚱하게 순간이동하며 컬러풀한 말풍선을 자주 날리고 다닙니다.'
  }
];

export const BUDDY_PHRASES: string[] = [
  '✨ 야르~',
  '🌙 밤티~',
  '👀 나 다 보고 있음',
  '🫵 딴짓 감지',
  '🚀 가보자고~',
  '🔥 폼 미쳤다',
  '🤝 오히려 좋아',
  '🗿 GOAT',
  '😎 일하는 척 굿',
  '💀 퇴근 마렵다',
  '📈 성장중',
  '⚡ 각성 완료',
  '🍀 오늘도 화이팅',
  '🏃 퇴근 RUN',
  '🫠 살아있냐...',
  '🤪 킹받네~',
  '💸 월급날 가자!',
  '🍻 불금 최고!'
];

export const DEFAULT_BUBLES_COLORS = [
  'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-950/80 dark:text-pink-300 dark:border-pink-800',
  'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800',
  'bg-green-100 text-green-800 border-green-300 dark:bg-green-950/80 dark:text-green-300 dark:border-green-800',
  'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800',
  'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800',
  'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-800',
  'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950/80 dark:text-cyan-300 dark:border-cyan-800',
  'bg-orange-100 text-orange-850 border-orange-300 dark:bg-orange-950/80 dark:text-orange-300 dark:border-orange-800',
  'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800',
  'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800'
];

export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: 'v1.0.6',
    date: '2026.06.04',
    title: '설정창 사이드바 리디자인 & 메이저 업데이트',
    badge: 'Latest',
    type: 'major',
    additions: [
      '🧭 설정창 사이드바 메뉴형 리디자인 (화이트 + 비비드 그라디언트)',
      '⚡ Chill / Buddy / Chaos 3단계 활동 모드 기능 선택 신설',
      '🏴‍☠️ 야르~ 타임! (화면 가득 황홀하게 내리는 65개 이모지 별가루 폭포)',
      '🧭 4분할 화면 활동 구역 지정 (전체 화면, 상하단 및 좌우 구석 고정)',
      '설정창 아코디언 UI 적용으로 필요한 기능만 하나씩 직관적으로 보기'
    ],
    fixes: [
      '드래그 앤 드롭 이동 시 떨림 현상 개선 및 부드러운 이동성 확보',
      '커스텀 이미지 아바타 로테이션 및 대칭 회전 방향성 연동 완벽 수정',
      '졸음방지 수면 차단 커스텀이 모드에 따라 작동하지 않던 루프 오류 긴급 조치',
      '과부하 방지를 위한 버디 동시 중복 룸메이트 소환 마릿수 최대 2개 제한'
    ]
  },
  {
    version: 'v1.0.5',
    date: '2026.06.01',
    title: '움직임 개선 & 새로운 모션 추가',
    type: 'minor',
    additions: [
      '🐢 느긋하게, 🚶 보통, ⚡ 광속 등 버디 속도 조절 기능',
      '화면 끝에 도달했을 때 헤엄치거나 박치기하는 벽 쿵 모션 애니메이션',
      '일하다 슬쩍 잠드는 귀여운 낮잠 모션 (💤 z z z)',
      '등장 및 이동 시 반짝반짝 효과 (✨ ⭐ 💫)',
      '구석이나 임의의 좌표로 즉시 사라지는 순간이동 기능 (💨)'
    ]
  },
  {
    version: 'v1.0.4',
    date: '2026.05.15',
    title: 'MZ 세대 감성 버디 기능 대통합',
    badge: 'Major Upgrade',
    type: 'major',
    additions: [
      '이모지 버디 및 커스텀 이미지 최적화 버디 모드',
      'MZ 신조어 대거 추가 ("야르~", "밤티~", "킹받네~" 등)',
      '이미지 교체 주기 (타이머) 직접 변경 및 10가지 컬러풀 말풍선 추가',
      '월급날 및 매주 불타는 금요일 맞춤 특별 문구 팝업',
      '버디 주변을 마구 더블클릭할 때 터지는 파티클 축제 효과',
      '숨어버린 버디를 한 번에 불러오는 우측 하단 "여기야!" 기능 버튼 추가',
      '버디 설정창 UI 최종 확인/취소 피드백 구조 설계'
    ],
    fixes: [
      '커스텀 이미지 모드 이모지 충돌 현상 수정',
      '윈도우 끝에서 이미지 각도가 뒤집히는 회전 로직 제거',
      '드래그 앤 드롭 이동 시 버디가 마우스를 탈출하는 드래그 버그 수정',
      '앱 내 텍스트 "펫"을 "버디"로 통일'
    ]
  },
  {
    version: 'v1.0.3',
    date: '2026.04.29',
    title: '커스텀 이미지 업로드 & 파티클',
    type: 'minor',
    additions: [
      'PNG, JPG, SVG 커스텀 이미지 업로드 및 크롭 기능',
      '버디 상호작용 시 불쑥 등장하는 기습 몬스터/이모지 (👻 🤖 😈 🦖)',
      '말풍선 클릭 시 나타나는 마우스 트레일 파티클 효과 개선'
    ],
    fixes: [
      '작업 표시줄 및 시스템 트레이 아이콘 가시성 개선'
    ]
  },
  {
    version: 'v1.0.2',
    date: '2026.04.10',
    title: '다양한 동물 친구들 참전!',
    type: 'minor',
    additions: [
      '다양한 동물 캐릭터 선택지 (고양이, 강아지, 토끼, 여우, 햄스터, 곰, 펭귄, 오리)',
      '플랫폼 전반 고해상도 Twemoji 세트 연동',
      '시스템 작업표시줄 미니 아이콘 및 트레이 아이콘 설정창 통합',
      '마우스 오클릭 시 빠른 메뉴 활성화'
    ]
  },
  {
    version: '🐱 첫 번째 릴리즈',
    date: '2026.03.14',
    title: '최애를 풀어놨다! 데스크탑 응원 메이트 첫 출시!',
    badge: 'First Launch',
    type: 'major',
    additions: [
      '화면 구석구석을 자유롭게 걸어다니는 킹받는 고양이 구현',
      '시간대별 위로와 잔소리 전담 문구 시스템',
      '마우스를 올리면 호다닥 도망가는 귀여운 도망 로직',
      '버디를 클릭하면 영롱한 별 가루가 팡팡 터지는 클릭 파티클 효과',
      '출근 시간, 퇴근 시간 지정으로 집중 방지 및 눈치 수면 타이밍 설정'
    ]
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: '완전 무료가 맞나요? 나중에 결제해야 하나요?',
    answer: '100% 영구 무료입니다. 추가 결제나 광고 유도 없이 평생 무료로 활용하실 수 있습니다.'
  },
  {
    question: '개인 강아지나 고양이 사진을 등록해 띄울 수 있나요?',
    answer: '네, 가능합니다. PNG, JPG 이미지 파일을 업로드하면 둥근 모양으로 자동 크롭되어 화면 위를 동동 다니게 됩니다.'
  },
  {
    question: '회사 PC인데 보안 상 위험하지는 않나요?',
    answer: '외부 서버와 일절 통신하지 않는 100% 로컬 독립 작동 파일입니다. 데이터 유출 걱정 없이 안전합니다.'
  },
  {
   question: '컴퓨터 사양이나 리소스를 많이 차지하나요?',
   answer: '백그라운드에서 조용히 작동하도록 설계되어, 일반적인 사무 및 영상 시청에는 영향이 없어요. 무거운 작업 중엔 Chill 모드를 추천해요!'
  },
];
