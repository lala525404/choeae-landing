import React from 'react';
import { motion } from 'motion/react';
import { 
  Tv, 
  Image as ImageIcon, 
  Zap, 
  Palette, 
  Users, 
  Sliders 
} from 'lucide-react';

interface FeatureCardProps {
  key?: any;
  icon: React.ReactNode;
  emoji: string;
  title: string;
  desc: string;
  tags?: string[];
  color: string;
  index: number;
}

function FeatureCard({ icon, emoji, title, desc, tags, color, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-850 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:-translate-y-1 hover:shadow-subtle-xl shadow-subtle-md transition-all duration-300 relative overflow-hidden group"
    >
      {/* Decorative colored glow on top left */}
      <div className={`absolute -top-10 -left-10 w-32 h-32 rounded-full filter blur-2xl opacity-15 dark:opacity-10 pointer-events-none group-hover:scale-125 transition duration-500 bg-gradient-to-tr ${color}`} />

      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50/70 dark:bg-stone-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black relative z-10 transition group-hover:scale-110 shadow-sm border border-indigo-100/30 dark:border-indigo-900/40">
            {icon}
          </div>
          <span className="text-3xl filter drop-shadow-sm select-none">{emoji}</span>
        </div>

        <h4 className="font-display font-black text-lg text-stone-900 dark:text-stone-100 flex items-center gap-1.5 mb-2">
          {title}
        </h4>
        <p className="text-stone-600 dark:text-stone-400 text-xs md:text-sm leading-relaxed mb-6 font-semibold">
          {desc}
        </p>
      </div>

      {tags && (
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {tags.map(t => (
            <span key={t} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50/60 dark:bg-stone-950 border border-indigo-100/40 dark:border-indigo-900/30 text-indigo-650 dark:text-indigo-350 shadow-none">
              {t}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function FeaturesGrid() {
  const features = [
    {
      icon: <Tv className="w-5 h-5" />,
      emoji: '🐱',
      title: '데스크탑 최상단 고정',
      desc: '모니터 화면 최상단에 둥둥 떠서 항상 활성화됩니다. 마우스 회피 기능과 클릭 감지 반응형 애니메이션을 제공합니다.',
      tags: ['최상단 활성화', '클릭 모션', '회피 로직'],
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: <ImageIcon className="w-5 h-5" />,
      emoji: '🖼️',
      title: '나만의 이미지 등록',
      desc: '반려동물, 연인이나 아이 사진 등 커스텀 파일을 직접 업로드해 나만의 움직이는 동동 투명 버디로 바로 등록합니다.',
      tags: ['PNG/JPG 업로드', '자동 원형 크롭', '로컬 독립 저장'],
      color: 'from-pink-500 to-purple-500'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      emoji: '✨',
      title: '실시간 상호작용',
      desc: '일정 주기로 낮잠(💤), 순수 벽치기(💥), 기습 순간이동 및 더블클릭 시 흩날리는 전용 이모지 파티클 축제 효과를 실행합니다.',
      tags: ['낮잠·벽치기 모션', '순간이동 로직', '파티클 시스템'],
      color: 'from-amber-400 to-yellow-500'
    },
    {
      icon: <Palette className="w-5 h-5" />,
      emoji: '🎨',
      title: '메시지 발송 & 말풍선',
      desc: '10가지 트렌디한 말풍선 컬러 테마를 기반으로 딴짓 방지 잔소리나 따뜻한 응원의 맞춤 멘트를 정기적으로 노출합니다.',
      tags: ['말풍선 테마', '커스텀 대사', '정기 알림 문구'],
      color: 'from-teal-400 to-emerald-500'
    },
    {
      icon: <Users className="w-5 h-5" />,
      emoji: '🎭',
      title: '동물 8종 캐릭터 가문',
      desc: '고양이, 강아지, 토끼, 여우, 햄스터, 곰돌이, 펭귄, 오리 등 귀여운 선호 캐릭터를 취향에 맞게 자유롭게 바꿔가며 띄웁니다.',
      tags: ['8가지 동물 기본 제공', '원클릭 전환 가능'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Sliders className="w-5 h-5" />,
      emoji: '⚙️',
      title: '옵션 정밀 제어',
      desc: '움직임 속도(3단계) 조절, 출퇴근 활동 시간 관리 기능 및 작업 표시줄 미니 아이콘 연동 옵션을 깔끔하게 통제합니다.',
      tags: ['이동 속도 조절', '출퇴근 관리', '트레이 아이콘'],
      color: 'from-violet-500 to-indigo-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feat, idx) => (
        <FeatureCard
          key={feat.title}
          icon={feat.icon}
          emoji={feat.emoji}
          title={feat.title}
          desc={feat.desc}
          tags={feat.tags}
          color={feat.color}
          index={idx}
        />
      ))}
    </div>
  );
}
