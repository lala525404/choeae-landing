import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Download, 
  Sparkles, 
  ShieldAlert, 
  Sun, 
  Moon, 
  Mail, 
  Check, 
  Chrome, 
  Monitor, 
  Smartphone,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sparkle,
  Smile,
  X
} from 'lucide-react';
import InteractiveBuddySimulator from './components/InteractiveBuddySimulator';
import FeaturesGrid from './components/FeaturesGrid';
import QuotesPreview from './components/QuotesPreview';
import ReleaseNotesTimeline from './components/ReleaseNotesTimeline';
import FAQCollapse from './components/FAQCollapse';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeDownload, setActiveDownload] = useState<'win' | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadStep, setDownloadStep] = useState<'init' | 'progress' | 'complete'>('init');
  const [activeTab, setActiveTab] = useState<'home' | 'features' | 'updates'>('home');

  // Sync theme with document class list
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // 모달 열고 확인 후 다운로드
  const startDownloadSimulation = (platform: 'win') => {
    setActiveDownload(platform);
    setDownloadStep('progress');
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadStep('complete');
          return 100;
        }
        return prev + 5 + Math.floor(Math.random() * 15);
      });
    }, 150);
  };

  // Connect to the inline quotes select trigger
  const handleQuoteInjected = (quoteText: string) => {
    // This finds the DOM controller submit flow from components or triggers alert
    console.log('Quote fed to global system:', quoteText);
  };

  const handleDirectDownload = () => {
    setActiveTab('home');
    startDownloadSimulation('win');
  };

  return (
    <div className="min-h-screen bg-[#F4F5FA] dark:bg-[#0c0d12] text-stone-900 dark:text-stone-100 transition-colors duration-300 font-sans selection:bg-purple-150 selection:text-purple-900 pb-16">
      
      {/* Dynamic Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#5e3df505_1px,transparent_1px),linear-gradient(to_bottom,#5e3df505_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* STICKY GLASS HEADER */}
      <header className="sticky top-4 z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="w-full h-16 flex items-center justify-between bg-white/90 dark:bg-stone-900/95 backdrop-blur-md px-4 md:px-8 rounded-full border border-stone-200/80 dark:border-stone-800 shadow-subtle-lg">
          
          {/* Logo Brand Accent */}
          <button 
            onClick={() => setActiveTab('home')} 
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <span className="text-2xl transition group-hover:scale-110 group-hover:rotate-12 select-none">🐱</span>
            <span className="font-display font-black text-lg md:text-xl tracking-tight text-black dark:text-stone-50">
              최애를 <span className="bg-gradient-to-r from-purple-500 via-[#7C3AED] to-indigo-500 bg-clip-text text-transparent">풀어놨습니다</span>
            </span>
          </button>

          {/* Tab Navigation Menu */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-3">
            <button 
              onClick={() => setActiveTab('home')} 
              className={`text-xs md:text-sm font-bold px-4 py-2 rounded-full border transition duration-200 cursor-pointer ${
                activeTab === 'home' 
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-transparent shadow-[0_4px_12px_rgba(124,58,237,0.15)]' 
                  : 'text-stone-700 dark:text-stone-300 border-transparent hover:bg-indigo-50/60 dark:hover:bg-stone-800'
              }`}
            >
              체험 및 Q&A
            </button>
            <button 
              onClick={() => setActiveTab('features')} 
              className={`text-xs md:text-sm font-bold px-4 py-2 rounded-full border transition duration-200 cursor-pointer ${
                activeTab === 'features' 
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-transparent shadow-[0_4px_12px_rgba(124,58,237,0.15)]' 
                  : 'text-stone-700 dark:text-stone-300 border-transparent hover:bg-indigo-50/60 dark:hover:bg-stone-800'
              }`}
            >
              기능 소개
            </button>
            <button 
              onClick={() => setActiveTab('updates')} 
              className={`text-xs md:text-sm font-bold px-4 py-2 rounded-full border transition duration-200 cursor-pointer ${
                activeTab === 'updates' 
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-transparent shadow-[0_4px_12px_rgba(124,58,237,0.15)]' 
                  : 'text-stone-700 dark:text-stone-300 border-transparent hover:bg-indigo-50/60 dark:hover:bg-stone-800'
              }`}
            >
              업데이트
            </button>



            {/* Sticky Install Shortcut Button */}
            <button
              onClick={handleDirectDownload}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-95 rounded-full px-4.5 py-1.5 text-xs font-black tracking-wide shadow-subtle-sm flex items-center gap-1.5 cursor-pointer hidden md:flex btn-neo-active"
            >
              <Download className="w-3.5 h-3.5" />
              <span>바로 다운로드</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT PORTAL WITH TAB TRANSITIONS */}
      <main className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.15 }}
            >
              {/* HERO SECTION */}
              <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-16 md:pb-20 overflow-hidden">
                <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-indigo-300/10 dark:bg-indigo-950/20 filter blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 left-1/4 w-96 h-96 rounded-full bg-purple-400/10 filter blur-3xl pointer-events-none" />

                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                  
                  {/* Version Badge & Status Indicator */}
                  <div className="inline-flex items-center gap-2 bg-indigo-50/80 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 px-4 py-1.5 rounded-full shadow-subtle-sm mb-6">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 tracking-tight">
                      최신 빌드 v1.0.6 정식 배포 완료
                    </span>
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/30 px-2 py-0.5 rounded-full text-amber-700 dark:text-amber-400 font-extrabold select-none">
                      Free
                    </span>
                  </div>

                  {/* Core Slogans / Title */}
                  <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-stone-900 dark:text-stone-50 leading-tight mb-4 select-none">
                    최애를 <span className="bg-gradient-to-r from-purple-500 via-[#7C3AED] to-indigo-500 bg-clip-text text-transparent">풀어놨습니다</span>
                  </h1>

                  <h2 className="font-sans font-extrabold text-xl sm:text-2xl lg:text-3xl text-stone-850 dark:text-stone-300 leading-normal max-w-xl mb-3">
                    "화면을 자유롭게 돌아다니는 최애!"
                  </h2>

                  {/* Simplified description */}
                  <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 max-w-xl mb-6 leading-relaxed font-semibold">
                    화면 위를 자유롭게 누비는 귀여운 버디 🐱<br />
                    마우스로 드래그하여 던지거나 꾹 찔러 상호작용해 보세요!
                  </p>

                  {/* Bullet points for core features */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-8 text-left">
                    <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-150 dark:border-stone-800/80 p-4 rounded-2xl select-none">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-1">🐾 화면 둥둥 버디</span>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
                        항상 화면 맨 위를 산책하며 분위기를 환기해 줍니다.
                      </p>
                    </div>
                    <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-150 dark:border-stone-800/80 p-4 rounded-2xl select-none">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-1">✨ 드래그 & 클릭 파티클</span>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
                        잡아서 옮기거나 클릭할 때 반짝이는 이모지 가루가 터집니다.
                      </p>
                    </div>
                    <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-150 dark:border-stone-800/80 p-4 rounded-2xl select-none">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-1">🖼️ 나만의 사진 커스텀</span>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
                        반려동물이나 최애 인물 이미지를 직접 올려 소환 가능합니다.
                      </p>
                    </div>
                  </div>

                  {/* Download Buttons Call to Action */}
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-8 justify-center">
                    <button
                      id="btn-win-download-hero"
                      onClick={() => startDownloadSimulation('win')}
                      className="bg-white/40 dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-stone-800 hover:bg-white/60 dark:hover:bg-stone-900/60 text-stone-900 dark:text-white rounded-2xl px-12 py-5 text-sm font-extrabold tracking-wide shadow-subtle-lg flex items-center justify-center gap-2.5 transition btn-neo-active cursor-pointer"
                      style={{ boxShadow: '0 8px 32px 0 rgba(124, 58, 237, 0.08), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)' }}
                    >
                      <span className="text-base font-black text-purple-700 dark:text-purple-300">🪟 Windows 버전 무료 다운로드</span>
                      <ArrowRight className="w-5 h-5 text-purple-600 dark:text-purple-400 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>

                  {/* Platform Badges */}
                  <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs text-stone-600 dark:text-stone-400 font-bold mb-8">
                    <span className="flex items-center gap-1.5">
                      <span className="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-100 dark:border-purple-900 text-[10px]">✔</span> 간편 설치 (설치 없이 바로 실행)
                    </span>
                    <span className="text-stone-300 dark:text-stone-800">|</span>
                    <span className="flex items-center gap-1.5">
                      <span className="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-100 dark:border-purple-900 text-[10px]">✔</span> 서버 통신 없는 100% 로컬 작동
                    </span>
                    <span className="text-stone-300 dark:text-stone-800">|</span>
                    <span className="flex items-center gap-1.5">
                      <span className="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-100 dark:border-purple-900 text-[10px]">✔</span> 무료 · 무단 배포·수정 금지
                    </span>
                  </div>

                  {/* Interactive hint floating tip card */}
                  <div className="bg-gradient-to-r from-purple-50 via-indigo-50/50 to-purple-50 dark:from-stone-900 dark:via-stone-950 dark:to-stone-900 rounded-2xl py-4 px-6 border border-purple-100/60 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 max-w-xl font-bold leading-relaxed shadow-subtle-sm transition-all hover:scale-[1.01]">
                     🐾 <strong>실시간 웹 화면 체험:</strong> 지금 이 브라우저 화면 위를 활보하는 귀여운 고양이 버디들이 보이시나요? 마우스로 들어서 옮겨주거나 클릭해 보세요! 지루한 업무 시간에 별가루 가득한 힐링을 드립니다!
                  </div>
                </div>
              </section>

              {/* MID LOGO BADGES */}
              <section className="bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-purple-500/5 py-4 border-y border-stone-150 dark:border-stone-850">
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 font-display font-extrabold text-stone-600 dark:text-stone-350 text-xs md:text-sm tracking-widest uppercase select-none">
                  <span className="flex items-center gap-1">
                    <span>🐱</span> 100% NON-PROFIT PROJECT
                  </span>
                  <span className="text-stone-300 dark:text-stone-700 hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <span>✨</span> TWEMOJI POWERED AVATARS
                  </span>
                  <span className="text-stone-300 dark:text-stone-700 hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <span>🗿</span> WORK HATE CLUB GOAT
                  </span>
                  <span className="text-stone-300 dark:text-stone-700 hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <span>💸</span> ALL FEATURES FREE FOREVER
                  </span>
                </div>
              </section>

              {/* STYLISH MAIN CORE FEATURES ON HOME */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <span className="inline-block bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900/40 px-4 py-1.5 rounded-full font-bold text-xs tracking-widest uppercase mb-4 shadow-subtle-sm">
                    CORE FEATURES
                  </span>
                  <h3 className="font-display font-black text-3xl sm:text-4xl text-stone-900 dark:text-stone-50 tracking-tight leading-tight mb-4">
                    모니터 위 귀여운 빌런들, 주요 기능 상세 ✨
                  </h3>
                  <p className="text-stone-605 dark:text-stone-400 text-xs md:text-sm leading-relaxed font-bold max-w-xl mx-auto">
                    단순한 데스크탑 버디를 넘어 정밀한 보폭 조절, 나만의 사진 커스텀 크롭, 
                    말풍선 주입까지 지원하는 든든한 기능들을 체험해 보세요!
                  </p>
                </div>

                <FeaturesGrid />
              </section>

              {/* COLLAPSE FAQ PANEL */}
              <section id="faq-section" className="max-w-4xl mx-auto px-4 py-16">
                <FAQCollapse />
              </section>

              {/* SELECTION PREMIUM DOWNLOAD CTA CARD */}
              <section id="download-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="relative bg-gradient-to-br from-indigo-950 to-slate-950 dark:from-stone-900 dark:to-stone-950 border border-indigo-500/20 rounded-[40px] p-8 md:p-16 text-white overflow-hidden shadow-subtle-xl">
                  <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-purple-500/10 filter blur-3xl pointer-events-none" />
                  <div className="absolute top-0 left-1/3 w-72 h-72 rounded-full bg-blue-500/10 filter blur-3xl pointer-events-none" />

                  <div className="relative max-w-3xl mx-auto text-center flex flex-col items-center">
                    <span className="text-4xl mb-4 select-none animate-bounce">⚡</span>
                    <h3 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight mb-4">
                      지금 바로 버디들을 무료로 소환해보세요
                    </h3>
                    <p className="text-indigo-200 text-xs md:text-sm max-w-xl mb-10 leading-relaxed font-semibold">
                      가장 단순하게 기분을 소생시켜 줄 든든한 '최애를 풀어놨습니다' 세트.<br className="hidden sm:inline" /> 현재 완전한 무료 베타 단계이므로 안심하고 소환 장전해 주십시오.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mb-8">
                      <button
                        id="btn-win-download-footer"
                        onClick={() => startDownloadSimulation('win')}
                        className="w-full bg-white/10 hover:bg-white/18 backdrop-blur-md border border-white/20 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-2.5 shadow-subtle-lg btn-neo-active transition duration-200 cursor-pointer"
                        style={{ boxShadow: '0 8px 32px 0 rgba(124, 58, 237, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)' }}
                      >
                        <span className="text-base text-white">🪟 Windows 버전 무료 다운로드</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-stone-300 text-xs font-semibold">
                      <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full shadow-subtle-sm">다운로드 바이너리 파일: v1.0.6 베타 공시 빌드</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full shadow-subtle-sm">스마트 스크린 가이드 완벽 제공</span>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'features' && (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.15 }}
            >
              {/* CORE FEATURES SECTION */}
              <section id="features-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="inline-block bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/30 px-4 py-1.5 rounded-full font-bold text-xs md:text-sm tracking-widest uppercase mb-4 shadow-subtle-sm">
                    FEATURES OVERVIEW
                  </span>
                  <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-stone-900 dark:text-stone-50 tracking-tight leading-tight mb-4">
                    모니터 위 귀여운 빌런들, 주요 기능 상세
                  </h3>
                  <p className="text-stone-500 dark:text-stone-400 text-xs md:text-base leading-relaxed font-semibold">
                     출근 카드, 사진 교체 주기 설정, 마우스 오클릭 시스템 메뉴까지 든든한 기술력을 감추고 있습니다.
                  </p>
                </div>

                <FeaturesGrid />
              </section>

              {/* INTERACTIVE SPEECH CARD PREVIEWS */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
                <QuotesPreview 
                  onQuoteSelect={(quote) => handleQuoteInjected(quote)} 
                />
              </section>
            </motion.div>
          )}

          {activeTab === 'updates' && (
            <motion.div
              key="updates"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.15 }}
            >
              {/* RELEASES TIMELINE SECTION */}
              <section id="timeline-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  
                  {/* Timeline sticky sidebar */}
                  <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-3xl shadow-subtle-lg">
                    <span className="inline-block bg-indigo-50 dark:bg-indigo-950/40 text-[#4F46E5] dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 px-3 py-1 rounded-full font-extrabold text-[10px] tracking-wider uppercase mb-3 text-center">
                      RELEASE TIMELINE
                    </span>
                    <h3 className="font-display font-black text-2xl md:text-3xl text-stone-900 dark:text-stone-50 tracking-tight leading-tight mb-4">
                      성장해나가는<br />우리들의 "최애를 풀어놨다!"
                    </h3>
                    <p className="text-stone-600 dark:text-stone-400 text-xs md:text-sm leading-relaxed mb-6 font-bold">
                      사용자 여러분의 번뜩이는 피드백을 기반으로 쉴 틈 없이 마이너/메이저 빌드를 올리고 있습니다. 고양이에서 출발해 곰, 펭귄, 그리고 아들 사진 커스텀까지 한평생 충실하겠습니다.
                    </p>
                    
                    <div className="bg-indigo-50/70 border border-indigo-100/60 dark:bg-indigo-950/15 dark:border-indigo-900/40 text-stone-850 dark:text-stone-300 rounded-2xl p-5 mb-2 shadow-subtle-sm">
                      <span className="text-xs font-black block mb-1 text-indigo-700 dark:text-indigo-400">📢 오픈소스 및 기능 제안</span>
                      <p className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed font-bold">
                        "이 동물이나 킹받는 회사 잔소리 문구도 추가해 주세요!" 하시는 말씀이 있다면 GitHub 기여 및 언제든 문의 이메일을 날려주세요!
                      </p>
                    </div>
                  </div>

                  {/* Interactive vertical scroll timeline */}
                  <div className="lg:col-span-8">
                    <ReleaseNotesTimeline />
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* PERSISTENT DOWNLOAD SIMULATION MODAL (REALISTIC EXPERIENCE) */}
      <AnimatePresence>
        {activeDownload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDownload(null)}
              className="absolute inset-0 bg-stone-950/70 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 md:p-8 shadow-subtle-xl z-10 text-stone-900 dark:text-stone-100"
            >
              {/* Close Button */}
              <button
                id="btn-close-download-modal"
                onClick={() => setActiveDownload(null)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <span className="text-4xl select-none mb-2 block font-extrabold">
                  🪟
                </span>
                <h4 className="font-display font-black text-xl text-stone-900 dark:text-stone-50">
                  Windows (.exe) 설치 준비 완료냥!
                </h4>
                <p className="text-xs text-stone-550 dark:text-stone-400 mt-1 font-extrabold">
                  work-hate-nyang-windows.exe (beta v1.0.6)
                </p>
              </div>

              {/* Progress Stage */}
              {downloadStep === 'progress' && (
                <div className="mb-6 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono font-black text-stone-800 dark:text-stone-300">
                    <span>안전 전용 회선 다운로드 중...</span>
                    <span>{downloadProgress}%</span>
                  </div>
                  {/* Progress track */}
                  <div className="w-full bg-stone-100 dark:bg-stone-950 rounded-full h-3 overflow-hidden border border-stone-200 dark:border-stone-800">
                    <motion.div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                  <span className="block text-[10px] text-center text-stone-500 font-extrabold">
                    로컬 시스템과 직결 통신으로 즉시 전집 패키징을 수행 중입니다.
                  </span>
                </div>
              )}

              {/* Download Complete & Safety Instructions */}
              {downloadStep === 'complete' && (
                <div className="space-y-6">
                  {/* Completed visual */}
                  <div className="bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-100 dark:border-emerald-900/35 p-4 rounded-2xl text-center shadow-subtle-sm">
                    <span className="block text-xl mb-1">🎉</span>
                    <span className="block text-xs font-black text-emerald-800 dark:text-emerald-300">
                      브라우저 다운로드 큐가 성공적으로 트리거되었습니다!
                    </span>
                    <a 
                      href="https://github.com/lala525404/nyang-pet-app/releases/download/v1.0.6/1.0.6.exe"
                      download
                      className="inline-flex items-center gap-1.5 mt-2.5 text-xs text-indigo-600 dark:text-indigo-450 hover:opacity-90 font-black underline decoration-dashed"
                    >
                      다운로드가 즉시 시작되지 않았다면, 여기를 직접 클릭하세요 📂
                    </a>
                  </div>

                  {/* Smart Bypass Step Guide */}
                  <div className="space-y-3.5">
                    <span className="block text-xs font-black text-stone-900 dark:text-stone-250 uppercase tracking-widest flex items-center gap-1">
                      <ShieldAlert className="w-4 h-4 text-amber-500" />
                      설치 시 주의경보 우회 안내 (베타 필수 가이드)
                    </span>

                    <div className="bg-amber-50/50 dark:bg-amber-950/15 p-4 rounded-xl border border-amber-100 dark:border-amber-900/35 space-y-2 shadow-subtle-sm">
                      <span className="block text-xs font-black text-stone-900 dark:text-stone-255">
                        Windows SmartScreen 알림 발생 시:
                      </span>
                      <p className="text-[11px] text-stone-800 dark:text-stone-450 leading-relaxed font-bold">
                        인증 기관 미확인에 따른 파란색 스마트스크린 창이 보일 경우, 창 내부의 <strong className="text-stone-900 dark:text-stone-100">[추가 정보]</strong> 링크를 클릭한 뒤 활성화되는 <strong className="text-purple-600">[실행]</strong> 버튼을 누르시면 정상적으로 로드됩니다.
                      </p>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex gap-2">
                    <button
                      id="btn-confirm-download-instructions"
                      onClick={() => {
                        window.open('https://github.com/lala525404/nyang-pet-app/releases/download/v1.0.6/1.0.6.exe', '_blank');
                        setActiveDownload(null);
                      }}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-95 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-500/10 cursor-pointer"
                    >
                      방책 확인 완료 & 버디 데려가기! ⭐
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER & GREETINGS */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-12 border-t border-stone-200 dark:border-stone-850">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-4 text-center md:text-left">
            <span className="font-display font-black text-xl text-stone-900 dark:text-stone-50">
              🐱 최애를 <span className="bg-gradient-to-r from-purple-500 via-[#7C3AED] to-indigo-500 bg-clip-text text-transparent">풀어놨습니다</span>
            </span>
            <p className="text-xs text-stone-600 dark:text-stone-450 mt-2 font-bold">
              "야르~ 오늘도 고단한 하루, 마음만은 가벼운 퇴근 RUN이다냥!"
            </p>
            <span className="block text-[10px] text-stone-400 dark:text-stone-650 mt-1 uppercase font-mono font-bold">
              © 2026 lala525404. All rights reserved. 본 소프트웨어 및 랜딩페이지의 무단 복제·수정·재배포·상업적 이용을 엄히 금합니다.
            </span>
          </div>

          {/* Quick interactive shortcut buttons */}
          <div className="md:col-span-8 flex flex-wrap justify-center md:justify-end gap-3">


            <button
              onClick={() => setActiveTab('updates')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-850 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 rounded-xl text-xs font-bold shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>오직 업데이트 내역</span>
            </button>

            <button
              id="btn-footer-inquiry"
              onClick={() => {
                const mailtoUrl = `mailto:lala525.404@gmail.com?subject=[최애를 풀어놨다] 기획 피드백 문의&body=소중한 피드백을 적어주세요!`;
                window.location.href = mailtoUrl;
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>건의 및 문의하기</span>
            </button>
          </div>
        </div>
      </footer>
      
      {/* Global Interactive Wandering Cats Overlay */}
      <InteractiveBuddySimulator />
    </div>
  );
}
