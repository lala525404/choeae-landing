import type {Buddy, DownloadInfo, FAQItem, Feature, InstallStep, ReleaseNote} from './types';

/** 제품명. 앱 안 표기와 같다. */
export const PRODUCT_NAME = '최애를 풀어놨습니다';

export const CONTACT_EMAIL = 'lala525.404@gmail.com';

export const CONTACT_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`[${PRODUCT_NAME}] 문의`)}`;

/** 다운로드 링크와 버전은 여기 한 곳에서만 고친다. 버튼 라벨의 버전 숫자도 여기서 나온다. */
export const DOWNLOADS = {
  windows: {
    name: 'Windows',
    version: '1.0.9',
    url: 'https://github.com/lala525404/nyang-pet-app/releases/download/v1.0.9/choeae-app-1.0.9.exe',
  },
  // 파일 이름이 이상해 보여도 실제 릴리스 에셋 이름이 이게 맞다.
  mac: {
    name: 'macOS',
    version: '1.0.8',
    url: 'https://github.com/lala525404/nyang-pet-app/releases/download/v1.0.8/-1.0.0-arm64.dmg',
    note: 'Apple Silicon(M1 이후) 전용',
  },
} satisfies Record<'windows' | 'mac', DownloadInfo>;

export type DownloadOS = keyof typeof DOWNLOADS;

export const downloadLabel = (os: DownloadOS) => `${DOWNLOADS[os].name}용 다운로드 v${DOWNLOADS[os].version}`;

export const fileLinkLabel = (os: DownloadOS) => `${DOWNLOADS[os].name}용 파일 받기 v${DOWNLOADS[os].version}`;

export const THEME_STORAGE_KEY = 'choeae-theme';

export const NAV_LINKS = [
  {href: '#features', label: '기능'},
  {href: '#install', label: '설치'},
  {href: '#updates', label: '업데이트'},
  {href: '#faq', label: 'FAQ'},
] as const;

export const twemojiSrc = (code: string) => `/twemoji/${code}.svg`;

export const BUDDIES: Buddy[] = [
  {id: 'cat', name: '고양이', code: '1f431'},
  {id: 'dog', name: '강아지', code: '1f436'},
  {id: 'rabbit', name: '토끼', code: '1f430'},
  {id: 'fox', name: '여우', code: '1f98a'},
  {id: 'hamster', name: '햄스터', code: '1f439'},
  {id: 'bear', name: '곰', code: '1f43b'},
  {id: 'penguin', name: '펭귄', code: '1f427'},
  {id: 'duck', name: '오리', code: '1f986'},
];

/** 히어로 걷기와 퇴근 알림 체험에 쓰는 버디 */
export const DEMO_BUDDY = BUDDIES[0];

/** 앱 퇴근 알림의 이모지 15종(러닝맨, 반짝이, 폭죽, 색종이, 로켓, 별, 바람, 만세, 불, 번개, 파티, 불꽃놀이, 샴페인, 무지개, 춤) */
export const LEAVE_EMOJI_CODES = [
  '1f3c3',
  '2728',
  '1f389',
  '1f38a',
  '1f680',
  '1f31f',
  '1f4a8',
  '1f64c',
  '1f525',
  '26a1',
  '1f973',
  '1f386',
  '1f37e',
  '1f308',
  '1f483',
];

export const SCREEN_FEATURES: Feature[] = [
  {title: '칩으로 바꿔요', text: '모드, 크기, 활동 구역, 움직임 속도를 칩 하나씩 눌러서 골라요.'},
  {title: '카드에서 바로', text: '점심·퇴근 알림 시간과 미리 알림을 카드 안에서 바로 바꿔요.'},
  {title: '저장 버튼 없이 즉시 적용', text: '값을 바꾸면 버디에 바로 반영돼요.'},
];

export const PHOTO_TIPS = [
  '파일 형식은 PNG를 권해요.',
  '크기는 200~300px 정도가 알맞아요.',
  '용량은 5MB 이하여야 해요.',
  '배경을 지운 PNG가 가장 자연스러워요.',
];

export const FEATURE_LIST: Feature[] = [
  {
    title: '활동 모드 3단계',
    text: 'Chill은 거의 안 움직이고 조용히 옆에 있어요. Buddy는 가끔 움직이고 말풍선도 띄워요. Chaos는 빠르게 날아다니고 이모지도 자주 나와요.',
  },
  {
    title: '4분할 활동 구역',
    text: '화면을 네 칸으로 나눠 좌상단·우상단·좌하단·우하단 중 한 곳에서만 돌아다니게 할 수 있어요. 모니터가 둘이면 어느 모니터에서 움직일지도 골라요.',
  },
  {title: '움직임 속도', text: '느긋하게부터 아주 빠르게까지 속도를 골라요.'},
  {
    title: '야르 타임',
    // TODO(확인 필요): v1.0.9의 간격 선택지를 확인하기 전까지 "정해 둔 간격마다"까지만 쓴다.
    text: '정해 둔 간격마다 이모지가 화면에 쏟아져요.',
  },
  {
    title: '졸림 방지',
    text: '졸린 오후에 이모지가 불쑥 나타나 잠을 깨워 줘요. 나타나는 주기는 직접 정해요.',
  },
  {
    title: '말풍선 문구',
    text: '버디가 시간대에 맞춰 한마디씩 해요. 매달 25일엔 월급 문구, 금요일엔 불금 문구가 나와요.',
  },
  {
    title: '점심·퇴근 알림',
    text: '정한 시각에 화면 가득 알려 줘요. 몇 분 전에 미리 알려 주는 알림도 있어요.',
  },
];

export const WINDOWS_STEPS: InstallStep[] = [
  {title: '받기', text: '위의 Windows용 다운로드 버튼으로 파일(.exe)을 받아요.', download: 'windows'},
  {
    title: '실행',
    // 앱 v1.0.9 package.json의 win target이 portable이라 설치 없이 실행으로 적었다.
    text: '받은 파일을 더블클릭해요. 따로 설치하지 않고 바로 실행돼요.',
  },
  {
    title: 'SmartScreen 안내',
    text: '"Windows의 PC 보호" 창이 뜨면 **추가 정보**를 누른 뒤 **실행**을 눌러요. 처음 받는 앱에는 이 창이 뜰 수 있어요.',
  },
];

export const MAC_STEPS: InstallStep[] = [
  {title: '받기', text: 'macOS용 다운로드 버튼으로 파일(.dmg)을 받아요.', download: 'mac'},
  {title: '옮기기', text: '받은 파일을 열고 앱을 응용 프로그램 폴더로 끌어 놓아요.'},
  {
    title: '처음 열 때',
    // TODO(확인 필요): Apple 서명·공증 여부. 앱 package.json에 서명·공증 설정이 없어 지금은 이 안내가 맞다.
    text: '"확인되지 않은 개발자" 같은 안내로 열리지 않으면 시스템 설정 → 개인정보 보호 및 보안에서 **그래도 열기**를 눌러요.',
  },
];

/** 새 버전일수록 위. folded는 "이전 버전 더 보기"를 누르기 전까지 접는다. */
export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: 'v1.0.9',
    date: '2026.10.19',
    title: '알림과 듀얼 모니터',
    latest: true,
    groups: [
      {
        label: '새로 생겼어요',
        items: [
          '점심·퇴근 알림이 생겼어요.',
          '일반 알람과 미리 알림이 생겼어요. 정한 시각 전에 미리 알려 줘요.',
          '듀얼 모니터를 지원해요. 버디가 모니터 사이를 오가요.',
          '활동 구역에서 어느 모니터에서 움직일지 고를 수 있어요.',
          '내 사진을 올릴 때 자를 수 있어요. 자르는 모양과 실제 버디 모양이 같아요.',
          '버디 설정에서 내 사진이 맨 앞에 보여요.',
        ],
      },
      {
        label: '고쳤어요',
        items: [
          '미리 알림 토스트가 제대로 뜨도록 고쳤어요.',
          '일반 알람이 점심 화면으로 먼저 뜨던 문제를 고쳤어요.',
          '알림이 연달아 올 때 타이머가 꼬이던 문제를 고쳤어요.',
          '설정창이 잘려 보이던 문제를 고쳤어요.',
        ],
      },
    ],
  },
  {
    version: 'v1.0.6',
    date: '2026.06.04',
    title: '설정창과 활동 모드',
    groups: [
      {
        label: '새로 생겼어요',
        items: [
          '설정창을 왼쪽 메뉴 방식으로 새로 꾸몄어요.',
          'Chill, Buddy, Chaos 세 가지 활동 모드가 생겼어요.',
          '야르~ 타임이 생겼어요. 화면 가득 이모지가 쏟아져요.',
          '활동 구역을 4분할로 정할 수 있어요.',
          '설정창을 항목별로 접고 펼 수 있어서 필요한 것만 볼 수 있어요.',
        ],
      },
      {
        label: '고쳤어요',
        items: [
          '버디를 끌어 옮길 때 떨리던 문제를 고쳤어요.',
          '내 사진 버디가 움직이는 방향과 이미지 방향이 맞지 않던 문제를 고쳤어요.',
          '모드에 따라 졸림 방지가 동작하지 않던 오류를 고쳤어요.',
          '버디가 한꺼번에 너무 많이 나오지 않도록 동시에 최대 2마리로 제한했어요.',
        ],
      },
    ],
  },
  {
    version: 'v1.0.5',
    date: '2026.06.01',
    title: '움직임과 모션',
    folded: true,
    groups: [
      {
        items: [
          '버디 속도를 고를 수 있어요.',
          '화면 끝에 닿으면 박치기하는 벽 쿵 모션이 생겼어요.',
          '일하다 슬쩍 잠드는 낮잠 모션이 생겼어요.',
          '나타나거나 움직일 때 반짝이는 효과가 생겼어요.',
          '구석이나 아무 곳으로 순간이동하는 기능이 생겼어요.',
        ],
      },
    ],
  },
  {
    version: 'v1.0.4',
    date: '2026.05.15',
    title: '버디가 더 살아났어요',
    folded: true,
    groups: [
      {
        label: '새로 생겼어요',
        items: [
          '이모지 버디와 내 이미지 버디에 맞춰 모드를 다듬었어요.',
          '말풍선에 "야르~", "밤티~", "킹받네~" 같은 요즘 말이 늘었어요.',
          '이미지 교체 주기를 직접 정할 수 있고, 말풍선 색이 10가지로 늘었어요.',
          '월급날과 금요일에 맞는 특별 문구가 나와요.',
          '버디 주변을 더블클릭하면 파티클이 터져요.',
          '숨어 버린 버디를 다시 부르는 "여기야!" 버튼이 생겼어요.',
          '설정창에 확인·취소 단계를 넣었어요.',
        ],
      },
      {
        label: '고쳤어요',
        items: [
          '내 이미지 모드에서 이모지와 겹치던 문제를 고쳤어요.',
          '화면 끝에서 이미지가 뒤집히던 동작을 없앴어요.',
          '끌어 옮길 때 버디가 마우스에서 빠져나가던 문제를 고쳤어요.',
          '앱 안의 "펫"이라는 말을 "버디"로 통일했어요.',
        ],
      },
    ],
  },
  {
    version: 'v1.0.3',
    date: '2026.04.29',
    title: '내 이미지 업로드',
    folded: true,
    groups: [
      {
        items: [
          // TODO(확인 필요): 이전 노트의 "크롭"은 v1.0.9의 "자르기가 생겼다"와 충돌해 뺐다. 실제 확인 필요.
          'PNG, JPG, SVG 이미지를 올려서 버디로 쓸 수 있어요.',
          '버디와 놀다 보면 유령, 로봇 같은 깜짝 이모지가 나타나요.',
          '말풍선을 누를 때 나오는 마우스 파티클 효과를 다듬었어요.',
          '작업 표시줄과 시스템 트레이 아이콘이 더 잘 보여요.',
        ],
      },
    ],
  },
  {
    version: 'v1.0.2',
    date: '2026.04.10',
    title: '동물 친구들',
    folded: true,
    groups: [
      {
        items: [
          '고양이, 강아지, 토끼, 여우, 햄스터, 곰, 펭귄, 오리 중에서 고를 수 있어요.',
          '버디 이미지를 더 선명한 Twemoji로 바꿨어요.',
          '작업 표시줄 미니 아이콘과 트레이 아이콘을 설정창에서 다룰 수 있어요.',
          '마우스 오른쪽 버튼으로 빠른 메뉴가 열려요.',
        ],
      },
    ],
  },
  {
    version: '첫 출시',
    date: '2026.03.14',
    folded: true,
    groups: [
      {
        items: [
          '화면 곳곳을 걸어 다니는 고양이 버디가 처음 나왔어요.',
          '시간대에 맞는 응원과 잔소리 문구가 나와요.',
          '마우스를 올리면 호다닥 도망가요.',
          '버디를 누르면 별 가루 파티클이 터져요.',
          '출근·퇴근 시간을 정할 수 있어요.',
        ],
      },
    ],
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: '무료인가요?',
    answer: ['네, 무료로 받아서 쓸 수 있어요. 앱 안에는 광고가 없어요.'],
  },
  {
    question: '내 강아지나 최애 사진도 버디로 쓸 수 있나요?',
    answer: [
      '네, 쓸 수 있어요. 사진을 올리고 원형이나 사각형으로 자르면 버디가 돼요. PNG, 200~300px, 5MB 이하를 권해요. 배경을 지운 PNG가 가장 자연스러워요.',
    ],
  },
  {
    question: '올린 사진은 어디에 저장되나요?',
    answer: ['내 사진과 설정은 내 컴퓨터에만 저장돼요.'],
  },
  {
    question: '회사 컴퓨터에 깔아도 되나요?',
    answer: [
      // TODO(확인 필요): "Windows 인증서 서명이 없다"는 사실 확인. 확인 전에는 서명 얘기를 빼고 SmartScreen 안내만 쓴다.
      '회사마다 보안 규칙이 달라서 먼저 확인해 보시길 권해요. 이 앱은 개인이 만든 앱이라서 처음 실행할 때 SmartScreen 안내가 뜰 수 있어요. 내 사진과 설정은 내 컴퓨터에만 저장돼요.',
    ],
  },
  {
    question: '컴퓨터가 느려지지 않나요?',
    answer: [
      // TODO(확인 필요): 실제 측정치는 없다. "영향 없다" 같은 단정은 쓰지 않는다.
      '가볍게 돌아가도록 만들었어요. 그래도 느려진다 싶으면 Chill 모드로 바꾸거나 버디 크기를 작게 해 보세요.',
    ],
  },
  {
    question: 'Windows에서 보안 경고가 떠요. 괜찮은가요?',
    answer: [
      '처음 받는 앱에는 "Windows의 PC 보호" 창이 뜰 수 있어요. 창에서 **추가 정보**를 누른 뒤 **실행**을 누르면 돼요. 파일은 이 사이트의 다운로드 버튼으로 받은 것만 실행해 주세요.',
    ],
  },
  {
    question: 'macOS에서 "확인되지 않은 개발자"라고 열리지 않아요.',
    answer: [
      // TODO(확인 필요): 서명·공증 여부에 따라 달라진다. 설치 안내 macOS 3단계와 같이 확정.
      '시스템 설정 → 개인정보 보호 및 보안에서 **그래도 열기**를 눌러 주세요.',
    ],
  },
  {
    question: '인텔 맥에서도 되나요?',
    answer: ['인텔 맥은 아직 지원하지 않아요. Apple Silicon(M1 이후) 맥에서만 쓸 수 있어요.'],
  },
  {
    question: '모드는 뭐가 다른가요?',
    answer: [
      'Chill은 거의 움직이지 않고 조용히 옆에 있어요. Buddy는 기본 설정이고, 가끔 움직이면서 말풍선도 띄워요. Chaos는 빠르게 날아다니고 이모지와 야르 타임도 자주 나와요.',
    ],
  },
  {
    question: '버디가 화면에서 사라졌어요.',
    answer: [
      // TODO(확인 필요): landing-copy는 "설정창의 버디 부르기 버튼"이라 적었지만, 앱 v1.0.9 main.cjs에서는 트레이 메뉴의 "버디 부르기"라서 그쪽으로 맞췄다.
      '작업 표시줄 오른쪽(맥은 메뉴 막대)의 트레이 아이콘을 우클릭해 **버디 부르기**를 눌러 보세요. 숨겨 둔 버디가 다시 나와요.',
    ],
  },
  {
    question: '버디를 숨기거나 앱을 끌 수 있나요?',
    answer: [
      // 앱 v1.0.9 main.cjs 기준: 트레이 메뉴(설정 열기, 버디 부르기, 버디 보이기, 버디 숨기기, 앱 종료), 버디 우클릭은 설정창.
      '작업 표시줄 오른쪽(맥은 메뉴 막대)의 트레이 아이콘을 우클릭하면 보이기·숨기기와 종료를 고를 수 있어요. 버디를 우클릭하면 설정창이 열려요.',
    ],
  },
  {
    question: '문의하거나 건의하고 싶어요.',
    answer: [`[${CONTACT_EMAIL}](${CONTACT_HREF}) 으로 메일을 보내 주세요. 하나하나 읽어 볼게요.`],
  },
];
