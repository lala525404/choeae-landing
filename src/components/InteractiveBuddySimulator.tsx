import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Trash2, 
  Upload, 
  Zap, 
  Compass, 
  AlertTriangle, 
  Play, 
  Smile, 
  Moon, 
  HelpCircle,
  Sparkles,
  Volume2
} from 'lucide-react';
import { BUDDY_CHARACTERS, BUDDY_PHRASES, DEFAULT_BUBLES_COLORS } from '../constants';
import { StateBuddy, Particle, BuddyCharacter, BuddyConfig } from '../types';

interface YarrrParticle {
  id: string;
  x: number;
  y: number;
  emoji: string;
  vy: number;
  vx: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  scale: number;
}

export default function InteractiveBuddySimulator() {
  const [buddies, setBuddies] = useState<StateBuddy[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [yarrrParticles, setYarrrParticles] = useState<YarrrParticle[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // App Settings States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('character');
  const [activityMode, setActivityMode] = useState<'chill' | 'buddy' | 'chaos'>('buddy');
  const [boundaryMode, setBoundaryMode] = useState<'all' | 'top' | 'bottom' | 'left' | 'right'>('all');
  const [preventSleep, setPreventSleep] = useState(false);
  
  // Custom image configurations
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('customBuddyImage') : null;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize first cat on mount
  useEffect(() => {
    const wWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const wHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    
    setBuddies([
      {
        id: 'cat-1',
        character: 'cat',
        x: wWidth * 0.45,
        y: wHeight * 0.35,
        vx: 1.1,
        vy: -0.7,
        rotation: 0,
        scaleX: 1,
        status: 'walk',
        speechText: '✨ 안녕! 하나만 조용히 돌아다닐게옹 (거북목 즉시 복원 시작!)',
        speechTimer: 5500,
        speechColor: 'bg-amber-100/95 text-amber-950 border-amber-300 dark:bg-amber-950/90 dark:text-amber-250 dark:border-amber-800',
        animationTimer: 2500
      }
    ]);
  }, []);

  // Show quick temporary toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Find character meta info helper
  const getCharMeta = (charId: BuddyCharacter): BuddyConfig => {
    const meta = BUDDY_CHARACTERS.find(c => c.id === charId);
    if (meta) return meta;
    
    // Custom character configuration mapping
    return {
      id: 'custom' as BuddyCharacter,
      name: '마법의 최애 ⭐️',
      emoji: '⭐',
      color: 'from-purple-500 to-pink-500',
      bgClass: 'bg-purple-150',
      borderClass: 'border-purple-400',
      accentColor: '#8B5CF6',
      description: '내가 직접 업로드한 소중한 사진 속 최애 동동이 버디입니다.'
    };
  };

  // Multiple Buddies Movement Logic loop
  useEffect(() => {
    const interval = setInterval(() => {
      setBuddies(prevBuddies => {
        return prevBuddies.map(buddy => {
          // If being dragged, do not calculate physics movement, but keep counting speech time down
          if (buddy.id === draggingId) {
            let sTimer = buddy.speechTimer;
            if (sTimer > 0) sTimer -= 100;
            return { ...buddy, speechTimer: sTimer, rotation: 0 };
          }

          let { 
            x, y, vx, vy, status, speechTimer, animationTimer, 
            speechText, speechColor, scaleX, rotation
          } = buddy;

          // Tick speech bubble visible timer
          if (speechTimer > 0) speechTimer -= 100;

          // Velocity modifier by Activity Mode
          let speedFactor = 1.0;
          if (activityMode === 'chill') {
            speedFactor = 0.55;
          } else if (activityMode === 'chaos') {
            speedFactor = 2.65;
          }

          // Force rotation wobble in walk mode, especially for custom image
          if (status === 'walk') {
            rotation = Math.sin(Date.now() / 250) * 8; // subtle tilt while walking
          } else if (status === 'sleep') {
            rotation = 90; // lie down sideways
          } else {
            rotation = 0;
          }

          // Custom state machine timer count down
          if (animationTimer > 0) {
            animationTimer -= 100;
          } else {
            // Random state transition triggers
            const randomVal = Math.random();
            
            // Sleep check - disabled if preventSleep is turned on
            if (randomVal < 0.16 && !preventSleep) {
              status = 'sleep';
              animationTimer = 4500;
              speechText = '💤 쿨쿨... 역시 이불 속에서 코딩하는게 최고다냐옹';
              speechColor = 'bg-stone-100 text-stone-700 dark:bg-stone-900/90 dark:text-stone-300 border-stone-200 dark:border-stone-800';
              speechTimer = 3550;
            } else {
              status = 'walk';
              animationTimer = 2500 + Math.random() * 4000;
              const angle = Math.random() * Math.PI * 2;
              const baseSpeed = (1.1 + Math.random() * 1.5) * speedFactor;
              vx = Math.cos(angle) * baseSpeed;
              vy = Math.sin(angle) * baseSpeed;
            }

            // High rate chaos emoji spitting
            if (activityMode === 'chaos' && Math.random() < 0.4 && status === 'walk') {
              // Spawns immediate floating flash particles
              spawnParticles(x + 30, y + 30);
            }

            // Occasional spontaneous quotes
            if (Math.random() < 0.28 && status !== 'sleep') {
              speechText = BUDDY_PHRASES[Math.floor(Math.random() * BUDDY_PHRASES.length)];
              speechColor = DEFAULT_BUBLES_COLORS[Math.floor(Math.random() * DEFAULT_BUBLES_COLORS.length)];
              speechTimer = 4000;
            }
          }

          // Position calculation based on status
          if (status === 'walk') {
            x += vx;
            y += vy;
          }

          // Dynamic boundary calculation based on selected BoundaryMode
          const size = 56;
          const wWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
          const wHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
          
          let minX = 15;
          let maxX = wWidth - size - 15;
          let minY = 80; // Keep space above for sticky nav
          let maxY = wHeight - size - 45;

          // 4-Quadrant Partition logic configurations
          if (boundaryMode === 'left') {
            maxX = wWidth * 0.5 - size;
          } else if (boundaryMode === 'right') {
            minX = wWidth * 0.5;
          } else if (boundaryMode === 'top') {
            maxY = wHeight * 0.5 - size;
          } else if (boundaryMode === 'bottom') {
            minY = wHeight * 0.5;
          }

          // Apply boundaries clamping and bounce trigger
          let bounced = false;

          if (x < minX) {
            x = minX;
            vx = Math.abs(vx);
            bounced = true;
          } else if (x > maxX) {
            x = maxX;
            vx = -Math.abs(vx);
            bounced = true;
          }

          if (y < minY) {
            y = minY;
            vy = Math.abs(vy);
            bounced = true;
          } else if (y > maxY) {
            y = maxY;
            vy = -Math.abs(vy);
            bounced = true;
          }

          if (bounced && status === 'walk') {
            status = 'wall';
            animationTimer = 1100;
            speechText = '💥 악! 구석벽에 마빡 부딪혔다옹!';
            speechColor = 'bg-rose-50 text-rose-900 border-rose-300 dark:bg-rose-950/90 dark:text-pink-300 dark:border-rose-900/40';
            speechTimer = 2000;
          }

          if (vx !== 0) {
            scaleX = vx > 0 ? 1 : -1;
          }

          return {
            ...buddy,
            x,
            y,
            vx,
            vy,
            scaleX,
            rotation,
            status,
            speechText,
            speechTimer,
            speechColor,
            animationTimer
          };
        });
      });
    }, 100);

    return () => clearInterval(interval);
  }, [draggingId, activityMode, boundaryMode, preventSleep]);

  // Particles gravity loop
  useEffect(() => {
    if (particles.length === 0) return;
    const frame = requestAnimationFrame(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15, // gravity
            opacity: p.opacity - 0.05,
            life: p.life - 0.05,
            scale: p.scale * 0.95
          }))
          .filter(p => p.opacity > 0)
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [particles]);

  // Yarrr Time (Emoji Full Waterfall) Particle Animation Loop
  useEffect(() => {
    if (yarrrParticles.length === 0) return;
    const frame = requestAnimationFrame(() => {
      setYarrrParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.12, // light gravity downwards
            rotation: p.rotation + p.rotationSpeed,
            opacity: p.y > window.innerHeight - 80 ? p.opacity - 0.08 : p.opacity,
            // bounce gently off bottom floor
            ...(p.y > window.innerHeight - 60 && p.vy > 0 ? { y: window.innerHeight - 60, vy: -p.vy * 0.55 } : {})
          }))
          .filter(p => p.opacity > 0 && p.y < window.innerHeight + 100)
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [yarrrParticles]);

  // Trigger Burst Emojis Spawning
  const spawnParticles = (clientX: number, clientY: number) => {
    const emojis = ['✨', '⭐️', '💫', '💖', '🐾', '🍀', '💥', '🐱', '🦄', '🍿', '🔥', '⚡️'];
    const newParticles: Particle[] = Array.from({ length: 12 }).map((_, i) => {
      const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 2.0 + Math.random() * 4.0;
      return {
        id: `p-${Date.now()}-${i}-${Math.random()}`,
        x: clientX,
        y: clientY,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        scale: 1.1 + Math.random() * 0.6,
        opacity: 1,
        life: 1
      };
    });
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Launch Yarrr Time Emoji Rain Storm Waterfall
  const triggerYarrrTimeWaterfall = () => {
    showToast('⚓️ 야르~ 가득한 우주 이모지 폭포가 내린다냐옹!');
    const emojis = ['✨', '⭐️', '💫', '💖', '🐾', '🍀', '🐱', '🐶', '🐰', '🦊', '🐹', '🐻', '🐧', '🦆', '💰', '🍉', '🍕', '🍻', '🌈', '🍦', '🍡'];
    const width = typeof window !== 'undefined' ? window.innerWidth : 1000;
    
    // Generate 65 falling emoji drops
    const newRainDrops: YarrrParticle[] = Array.from({ length: 65 }).map((_, i) => {
      return {
        id: `ydr-${Date.now()}-${i}-${Math.random()}`,
        x: Math.random() * width,
        y: -100 - Math.random() * 320, // staggered entrance heights
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        vx: -1.0 + Math.random() * 2.0,
        vy: 2.0 + Math.random() * 5.0, // vertical speeds
        rotation: Math.random() * 360,
        rotationSpeed: -6 + Math.random() * 12,
        scale: 1.0 + Math.random() * 1.4,
        opacity: 1.0
      };
    });

    setYarrrParticles(prev => [...prev, ...newRainDrops]);
  };

  // Drag and drop mechanics - Pointer Move fixes (pointer capture handles screen borders)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    
    setDraggingId(id);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    target.setPointerCapture(e.pointerId);

    // Stop and set status to idle for active feel
    setBuddies(prev => prev.map(b => b.id === id ? { ...b, vx: 0, vy: 0, status: 'idle', rotation: 0 } : b));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
    if (draggingId !== id) return;
    
    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;

    setBuddies(prev => prev.map(b => b.id === id ? { ...b, x, y } : b));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
    if (draggingId === id) {
      setDraggingId(null);
      e.currentTarget.releasePointerCapture(e.pointerId);

      const angle = Math.random() * Math.PI * 2;
      const s = 1.3 + Math.random() * 1.5;

      setBuddies(prev => prev.map(b => b.id === id ? {
        ...b,
        vx: Math.cos(angle) * s,
        vy: Math.sin(angle) * s,
        status: 'walk',
        animationTimer: 2000
      } : b));

      spawnParticles(e.clientX, e.clientY);
    }
  };

  // Toggle or Summon specific Buddy, limited to MAX 2
  const summonCharacter = (charId: BuddyCharacter) => {
    if (buddies.length >= 2) {
      showToast('⚠️ 최애 버디는 최대 2마리까지만 풀어놓을 수 있습니다! (과부하 방지)');
      return;
    }

    const wWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const wHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const newId = `buddy-${Date.now()}-${Math.random()}`;
    const meta = getCharMeta(charId);

    const isCustom = charId === 'custom';
    if (isCustom && !customImageBase64) {
      showToast('📸 먼저 사용할 사진 또는 커스텀 이미지를 등록해 주세요!');
      setActiveAccordion('custom-img');
      return;
    }

    const newBuddy: StateBuddy = {
      id: newId,
      character: charId,
      customImageUrl: isCustom && customImageBase64 ? customImageBase64 : undefined,
      customEmoji: isCustom ? '⭐️' : meta.emoji,
      x: wWidth * (0.2 + Math.random() * 0.6),
      y: wHeight * (0.3 + Math.random() * 0.4),
      vx: 1.2 * (Math.random() > 0.5 ? 1 : -1),
      vy: 1.0 * (Math.random() > 0.5 ? 1 : -1),
      rotation: 0,
      scaleX: 1,
      status: 'walk',
      speechText: `🎉 나도 같이 띄웠다옹! (${meta.name === '마법의 최애 ⭐️' ? '사진 최애' : meta.name})`,
      speechTimer: 4200,
      speechColor: DEFAULT_BUBLES_COLORS[Math.floor(Math.random() * DEFAULT_BUBLES_COLORS.length)],
      animationTimer: 3000
    };

    setBuddies(prev => [...prev, newBuddy]);
    spawnParticles(newBuddy.x + 30, newBuddy.y + 30);
    showToast(`🐾 ${meta.name}가(이) 추가 소환되었습니다!`);
  };

  // Dismiss / Remove specific buddy
  const dismissBuddy = (id: string) => {
    setBuddies(prev => prev.filter(b => b.id !== id));
    showToast('👋 버디가 주머니 속으로 슥 복귀했습니다.');
  };

  // Image Upload handler
  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('❌ 파일 크기가 너무 큽니다! (최대 2MB 이내만 권장)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      setCustomImageBase64(resultStr);
      localStorage.setItem('customBuddyImage', resultStr);
      showToast('📸 나만의 최애 사진 등록 성공! 이제 캐릭터에서 최애를 소환해보라옹!');
      
      // Update existing custom buddies base64 instantly as well
      setBuddies(prev => prev.map(b => b.character === 'custom' ? { ...b, customImageUrl: resultStr } : b));
    };
    reader.readAsDataURL(file);
  };

  // Utility to clear custom uploaded photo
  const deleteCustomImage = () => {
    setCustomImageBase64(null);
    localStorage.removeItem('customBuddyImage');
    showToast('♻️ 원형 커스텀 사진이 제거되었습니다.');
    // Dismiss custom buddies
    setBuddies(prev => prev.filter(b => b.character !== 'custom'));
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      
      {/* ⚠️ Custom toast alerts */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-stone-900/95 border-2 border-purple-500 text-stone-900 dark:text-stone-50 px-6 py-3.5 rounded-2xl shadow-subtle-xl font-bold text-xs pointer-events-auto z-[250] flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-spin-slow" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Basic interactive particle sparks */}
      {particles.map(p => (
        <div
          key={p.id}
          className="fixed pointer-events-none select-none transition-opacity duration-150"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            opacity: p.opacity,
            transform: `translate(-50%, -50%) scale(${p.scale})`,
            fontSize: '24px',
            zIndex: 190
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* 야르~ 타임 이모지 낙하 폭포 */}
      {yarrrParticles.map(p => (
        <div
          key={p.id}
          className="fixed pointer-events-none select-none transition-transform"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            opacity: p.opacity,
            transform: `translate(-50%, -50%) scale(${p.scale}) rotate(${p.rotation}deg)`,
            fontSize: '32px',
            zIndex: 180
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* WANDERING BUDDIES */}
      {buddies.map((buddy) => {
        const charMeta = getCharMeta(buddy.character);
        const isSleep = buddy.status === 'sleep';
        const isWall = buddy.status === 'wall';
        const currentEmoji = buddy.customEmoji || charMeta.emoji;

        return (
          <div
            key={buddy.id}
            onPointerDown={(e) => handlePointerDown(e, buddy.id)}
            onPointerMove={(e) => handlePointerMove(e, buddy.id)}
            onPointerUp={(e) => handlePointerUp(e, buddy.id)}
            onClick={(e) => {
              e.stopPropagation();
              spawnParticles(e.clientX, e.clientY);
              
              const clickPhrases = [
                '🐾 냥! 건드리지 말라옹! 딴짓하느라 바쁩니다!',
                '💘 나 너무 귀엽냥? 더 만져라냐옹!',
                '😜 딴짓 감시 시스템 최고 성능 검증 완!',
                '🍀 거북목 복원 즉시 실행! 허리 당장 펴라옹!',
                '💸 월급 가치 보존 마법 활성화 중! 화이팅옹!'
              ];
              
              setBuddies(prev => prev.map(b => b.id === buddy.id ? {
                ...b,
                speechText: clickPhrases[Math.floor(Math.random() * clickPhrases.length)],
                speechTimer: 4500,
                speechColor: DEFAULT_BUBLES_COLORS[Math.floor(Math.random() * DEFAULT_BUBLES_COLORS.length)]
              } : b));
            }}
            className="fixed select-none cursor-grab active:cursor-grabbing pointer-events-auto group touch-none"
            style={{
              left: `${buddy.x}px`,
              top: `${buddy.y}px`,
              // Render scaleX mirror but also rotation (correctly solves custom image rotation)
              transform: `scaleX(${buddy.scaleX}) rotate(${buddy.rotation}deg)`,
              transition: draggingId === buddy.id ? 'none' : 'transform 0.15s ease-out',
              zIndex: draggingId === buddy.id ? 220 : 200
            }}
          >
            {/* Visual presentation */}
            <div className="relative flex flex-col items-center select-none">
              
              {/* Actual Avatar Frame (Emoji or Rounded Custom Photo) */}
              <div 
                className={`w-14 h-14 bg-transparent border border-transparent flex items-center justify-center text-4xl transition-all duration-300 group-hover:scale-125`}
              >
                {buddy.customImageUrl ? (
                  <img
                    src={buddy.customImageUrl}
                    alt="Custom Buddy Avatar"
                    className="w-13 h-13 rounded-full object-cover border-2 shadow-subtle-sm"
                    style={{
                      borderColor: charMeta.accentColor || '#a855f7',
                      // Smooth representation without mirroring custom original images awkwardly if requested
                      transform: buddy.scaleX < 0 ? 'scaleX(-1)' : 'none'
                    }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{currentEmoji}</span>
                )}
              </div>

              {/* Status micro overlays */}
              {isSleep && (
                <span className="absolute top-0 right-0 bg-indigo-500/90 text-white rounded-full text-[9px] px-1.5 py-0.5 font-black animate-pulse shadow-sm">💤</span>
              )}
              {isWall && (
                <span className="absolute top-0 right-0 bg-red-500/90 text-white rounded-full text-[9px] px-1.5 py-0.5 font-black animate-bounce shadow-sm">💥</span>
              )}
            </div>
          </div>
        );
      })}

      {/* ⚙️ SIDEBAR SLIDE-IN CONTROLLER PANEL (WHITE BACKGROUND + VIVID GRADIENTS / ACCENTS) */}
      <div className="pointer-events-auto fixed bottom-6 right-6 z-[240] flex items-center gap-2">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-14 h-14 bg-gradient-to-tr from-purple-500 via-[#7C3AED] to-indigo-500 text-white rounded-full flex items-center justify-center shadow-subtle-xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none"
          title="최애 버디 설정창 열기"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Settings className="w-6 h-6 animate-spin-slow" />}
        </button>
      </div>

      <div 
        className={`pointer-events-auto fixed top-0 bottom-0 right-0 w-[380px] max-w-full bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-850 shadow-subtle-2xl z-[230] flex flex-col transition-transform duration-350 ease-out transform ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Colorful Gradient Vivid Header */}
        <div className="p-6 bg-gradient-to-r from-purple-500 via-[#7C3AED] to-indigo-500 text-white relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-pulse">⚙️</span>
              <div>
                <h4 className="font-display font-black text-base tracking-tight text-white leading-tight">
                  최애 통제 설정 센터
                </h4>
                <p className="text-[10px] text-purple-100 font-extrabold mt-0.5 uppercase tracking-wider">
                  v1.0.6 Official Control
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 px-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
            >
              닫기 ✕
            </button>
          </div>
        </div>

        {/* Status Indicators list showing summoned controllers */}
        <div className="p-4 bg-stone-50 border-b border-stone-150/70 dark:bg-stone-900/60 dark:border-stone-800 flex justify-between items-center gap-2">
          <span className="text-[11px] font-black text-stone-600 dark:text-stone-350 uppercase tracking-widest block">
            현재 활동 중인 최애 ({buddies.length}/2마리)
          </span>
          <div className="flex items-center gap-1.5">
            {buddies.map(b => {
              const meta = getCharMeta(b.character);
              return (
                <div 
                  key={b.id}
                  className="inline-flex items-center gap-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-750 rounded-lg px-2 py-1 text-[11px] font-bold"
                >
                  <span>{b.character === 'custom' ? '📸' : meta.emoji}</span>
                  <button 
                    onClick={() => dismissBuddy(b.id)}
                    className="text-stone-400 hover:text-red-500 ml-1 transition"
                    title="복귀 소환 해제"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollable Accordions Setup container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          
          {/* ACCORDION 1: 버디 소환하기 */}
          <div className="border border-stone-150 dark:border-stone-800 rounded-2xl overflow-hidden bg-white dark:bg-stone-900 shadow-sm">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 'character' ? null : 'character')}
              className="w-full flex items-center justify-between p-4 font-black text-xs text-stone-800 dark:text-stone-150 hover:bg-stone-50 dark:hover:bg-stone-850/60 transition text-left"
            >
              <span className="flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400">🐾</span>
                <span>최애 버디 소환 (최대 2마리)</span>
              </span>
              {activeAccordion === 'character' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {activeAccordion === 'character' && (
              <div className="p-4 border-t border-stone-100 dark:border-stone-850 space-y-3">
                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal font-bold">
                  아래 기본 동물 세트 중 마음에 드는 최애를 클릭하여 띄우세요. 화면 위를 즉시 걸어다니기 시작합니다!
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {BUDDY_CHARACTERS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => summonCharacter(c.id)}
                      className="bg-stone-50 dark:bg-stone-950/40 hover:bg-purple-50 dark:hover:bg-purple-950/20 border border-stone-200 dark:border-stone-800/80 hover:border-purple-300 dark:hover:border-purple-900 rounded-xl p-2.5 transition text-left cursor-pointer flex items-center gap-2 group"
                    >
                      <span className="text-2xl group-hover:scale-125 transition-transform">{c.emoji}</span>
                      <div className="overflow-hidden">
                        <span className="block text-xs font-black text-stone-800 dark:text-stone-100 truncate">{c.name}</span>
                        <span className="block text-[8px] text-stone-400 truncate">소환 대기 중</span>
                      </div>
                    </button>
                  ))}
                  
                  {/* Custom upload selector shortcut inside character grid */}
                  <button
                    onClick={() => summonCharacter('custom')}
                    className={`border border-dashed rounded-xl p-2.5 transition text-left cursor-pointer flex items-center gap-2 group ${
                      customImageBase64 
                        ? 'bg-purple-50/40 border-purple-300 dark:bg-purple-950/10 dark:border-purple-800 hover:bg-purple-100/50' 
                        : 'border-stone-300 dark:border-stone-800 text-stone-500 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-2xl group-hover:animate-pulse">
                      {customImageBase64 ? '📸' : '➕'}
                    </span>
                    <div className="overflow-hidden">
                      <span className="block text-xs font-black text-stone-800 dark:text-stone-100 truncate">내 사진 최애</span>
                      <span className="block text-[8px] text-stone-400 truncate">
                        {customImageBase64 ? '업로드 완료' : '사진 등록 선 필요'}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ACCORDION 2: 활동 모드 설정 (Chill / Buddy / Chaos) */}
          <div className="border border-stone-150 dark:border-stone-800 rounded-2xl overflow-hidden bg-white dark:bg-stone-900 shadow-sm">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 'mode' ? null : 'mode')}
              className="w-full flex items-center justify-between p-4 font-black text-xs text-stone-800 dark:text-stone-150 hover:bg-stone-50 dark:hover:bg-stone-850/60 transition text-left"
            >
              <span className="flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400">⚡</span>
                <span>활동 모드 제어 (Chil / Buddy / Chaos)</span>
              </span>
              {activeAccordion === 'mode' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {activeAccordion === 'mode' && (
              <div className="p-4 border-t border-stone-100 dark:border-stone-850 space-y-4">
                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal font-bold">
                  버디들의 활동 텐션과 보폭 속도를 상황에 맞게 3단계 조절할 수 있습니다.
                </p>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setActivityMode('chill');
                      showToast('🐢 릴랙스 Chill 모드 가동! 버디가 몹시 평온하고 느리게 이동합니다.');
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition text-left cursor-pointer ${
                      activityMode === 'chill' 
                        ? 'bg-purple-50/70 dark:bg-purple-950/20 border-purple-400 dark:border-purple-800' 
                        : 'bg-stone-50 border-stone-200/60 hover:bg-stone-100 dark:bg-stone-950/20 dark:border-stone-800'
                    }`}
                  >
                    <div>
                      <span className="block text-xs font-black text-stone-800 dark:text-stone-100">🐢 Chill (평온 모드)</span>
                      <span className="block text-[9px] text-stone-400 mt-0.5">매우 느린 보조속도로 귀를 쫑긋거리며 유유자적합니다.</span>
                    </div>
                    {activityMode === 'chill' && <span className="text-xs text-purple-600 font-extrabold">선택됨</span>}
                  </button>

                  <button
                    onClick={() => {
                      setActivityMode('buddy');
                      showToast('🚶 Buddy 표준 모드 가동! 보통 일상 속도로 순찰합니다.');
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition text-left cursor-pointer ${
                      activityMode === 'buddy' 
                        ? 'bg-purple-50/70 dark:bg-purple-950/20 border-purple-400 dark:border-purple-800' 
                        : 'bg-stone-50 border-stone-200/60 hover:bg-stone-100 dark:bg-stone-950/20 dark:border-stone-800'
                    }`}
                  >
                    <div>
                      <span className="block text-xs font-black text-stone-800 dark:text-stone-100">🚶 Buddy (일상 모드)</span>
                      <span className="block text-[9px] text-stone-400 mt-0.5">기본 1.0의 균형 잡힌 속도로 자연스레 순찰하며 소통합니다.</span>
                    </div>
                    {activityMode === 'buddy' && <span className="text-xs text-purple-600 font-extrabold">선택됨</span>}
                  </button>

                  <button
                    onClick={() => {
                      setActivityMode('chaos');
                      showToast('🔥 Chaos 카오스 난장판 가동! 사방팔방 엄청난 열정과 속도로 돌진합니다.');
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition text-left cursor-pointer ${
                      activityMode === 'chaos' 
                        ? 'bg-purple-50/70 dark:bg-purple-950/20 border-purple-400 dark:border-purple-800' 
                        : 'bg-stone-50 border-stone-200/60 hover:bg-stone-100 dark:bg-stone-950/20 dark:border-stone-800'
                    }`}
                  >
                    <div>
                      <span className="block text-xs font-black text-stone-800 dark:text-stone-100">🔥 Chaos (난장판 폭주 모드)</span>
                      <span className="block text-[9px] text-stone-400 mt-0.5">폭주하며 이동 중에도 별가루가 우수수 터지고 초광속 산책합니다.</span>
                    </div>
                    {activityMode === 'chaos' && <span className="text-xs text-purple-600 font-extrabold">선택됨</span>}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ACCORDION 3: 4분할 활동 구역 제어 */}
          <div className="border border-stone-150 dark:border-stone-800 rounded-2xl overflow-hidden bg-white dark:bg-stone-900 shadow-sm">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 'boundary' ? null : 'boundary')}
              className="w-full flex items-center justify-between p-4 font-black text-xs text-stone-800 dark:text-stone-150 hover:bg-stone-50 dark:hover:bg-stone-850/60 transition text-left"
            >
              <span className="flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400">🧭</span>
                <span>버디 활동 구역 제어 (4분할 지역)</span>
              </span>
              {activeAccordion === 'boundary' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {activeAccordion === 'boundary' && (
              <div className="p-4 border-t border-stone-100 dark:border-stone-850 space-y-3">
                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal font-bold">
                  버디들이 지나치게 내 작업 영역(에디터나 본문 등)에 들어와 방해하지 않도록, 특정 4분할 화면 경계 구역에만 귀양 보낼 수 있습니다!
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setBoundaryMode('all');
                      showToast('🧭 [전체 화면] 전체를 자유롭게 활보합니다!');
                    }}
                    className={`p-2 rounded-xl border text-center font-bold text-xs cursor-pointer ${
                      boundaryMode === 'all' ? 'bg-purple-500 text-white border-transparent' : 'bg-stone-50 hover:bg-stone-100 text-stone-850'
                    }`}
                  >
                    🌐 전체 활보
                  </button>
                  <button
                    onClick={() => {
                      setBoundaryMode('top');
                      showToast('🧭 [상단 50%] 상단 구역에서만 노닙니다.');
                    }}
                    className={`p-2 rounded-xl border text-center font-bold text-xs cursor-pointer ${
                      boundaryMode === 'top' ? 'bg-purple-500 text-white border-transparent' : 'bg-stone-50 hover:bg-stone-100 text-stone-850'
                    }`}
                  >
                    ⬆️ 상단 50%
                  </button>
                  <button
                    onClick={() => {
                      setBoundaryMode('bottom');
                      showToast('🧭 [하단 50%] 하단 작업 표시줄 부근 고정.');
                    }}
                    className={`p-2 rounded-xl border text-center font-bold text-xs cursor-pointer ${
                      boundaryMode === 'bottom' ? 'bg-purple-500 text-white border-transparent' : 'bg-stone-50 hover:bg-stone-100 text-stone-850'
                    }`}
                  >
                    ⬇️ 하단 50%
                  </button>
                  <button
                    onClick={() => {
                      setBoundaryMode('left');
                      showToast('🧭 [좌측 50%] 화면 왼편 구석 산책.');
                    }}
                    className={`p-2 rounded-xl border text-center font-bold text-xs cursor-pointer ${
                      boundaryMode === 'left' ? 'bg-purple-500 text-white border-transparent' : 'bg-stone-50 hover:bg-stone-100 text-stone-850'
                    }`}
                  >
                    ⬅️ 좌측 50%
                  </button>
                  <button
                    onClick={() => {
                      setBoundaryMode('right');
                      showToast('🧭 [우측 50%] 화면 오른편 구석 고정.');
                    }}
                    className={`p-2 rounded-xl border text-center font-bold text-xs cursor-pointer ${
                      boundaryMode === 'right' ? 'bg-purple-500 text-white border-transparent' : 'bg-stone-50 hover:bg-stone-100 text-stone-850'
                    }`}
                  >
                    ➡️ 우측 50%
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ACCORDION 4: 나만의 사진 커스텀 */}
          <div className="border border-stone-150 dark:border-stone-800 rounded-2xl overflow-hidden bg-white dark:bg-stone-900 shadow-sm">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 'custom-img' ? null : 'custom-img')}
              className="w-full flex items-center justify-between p-4 font-black text-xs text-stone-800 dark:text-stone-150 hover:bg-stone-50 dark:hover:bg-stone-850/60 transition text-left"
            >
              <span className="flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400">🖼️</span>
                <span>나만의 사진 커스텀 등록</span>
              </span>
              {activeAccordion === 'custom-img' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {activeAccordion === 'custom-img' && (
              <div className="p-4 border-t border-stone-100 dark:border-stone-850 space-y-4">
                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal font-bold">
                  소중한 반려견, 반려묘, 아이, 또는 연인의 얼굴 JPG/PNG 사진을 올리세요. 자동으로 동글동글 원형 아바타 크롭되어 화면 위로 둥둥 보정 소환됩니다! (움직이며 반사/회전 완전 입체화 지원)
                </p>

                {customImageBase64 ? (
                  <div className="bg-purple-50/50 dark:bg-purple-950/10 border border-purple-200 dark:border-purple-900 rounded-2xl p-4 flex items-center gap-4">
                    <img 
                      src={customImageBase64} 
                      alt="Uploaded Crop Preview" 
                      className="w-14 h-14 rounded-full object-cover border-2 border-purple-500 shadow-sm"
                    />
                    <div className="flex-1">
                      <span className="block text-xs font-black text-purple-950 dark:text-purple-200">등록된 최애 사진 원본</span>
                      <span className="block text-[10px] text-stone-400 mt-1">로컬 독립 브라우저 데이터베이스 저장 완료</span>
                      
                      <button
                        onClick={deleteCustomImage}
                        className="flex items-center gap-1 text-[10px] text-red-500 hover:text-red-700 font-bold mt-2 underline"
                      >
                        <Trash2 className="w-3 nav-icon text-red-500" />
                        사진 지우기
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-300 dark:border-stone-800 hover:border-purple-400 dark:hover:border-purple-900 rounded-2xl p-6 text-center cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-850/40 transition"
                  >
                    <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                    <span className="block text-xs font-black text-stone-700 dark:text-stone-300">내 로컬 파일 선택하기</span>
                    <span className="block text-[9px] text-stone-400 mt-1">PNG, JPG, JPEG 지원 (최대 2MB)</span>
                  </div>
                )}

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleCustomImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            )}
          </div>

          {/* ACCORDION 5: 졸림 방지 및 마법 효과 */}
          <div className="border border-stone-150 dark:border-stone-800 rounded-2xl overflow-hidden bg-white dark:bg-stone-900 shadow-sm">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 'effects' ? null : 'effects')}
              className="w-full flex items-center justify-between p-4 font-black text-xs text-stone-800 dark:text-stone-150 hover:bg-stone-50 dark:hover:bg-stone-850/60 transition text-left"
            >
              <span className="flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400">⚙️</span>
                <span>졸림 방지 & 특수 마법 이펙트</span>
              </span>
              {activeAccordion === 'effects' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {activeAccordion === 'effects' && (
              <div className="p-4 border-t border-stone-100 dark:border-stone-850 space-y-4">
                
                {/* Prevent Sleep Checkbox Toggle */}
                <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-950/40 border border-stone-150 dark:border-stone-800/80 rounded-xl p-3">
                  <div className="flex-1 pr-2">
                    <span className="block text-xs font-black text-stone-800 dark:text-stone-100">💤 낮잠 수면 방지 통제</span>
                    <span className="block text-[10px] text-stone-400 mt-0.5 font-semibold">
                      활성화 시 버디들이 졸아 쓰러지지 않고 지속해서 주인을 깨우고 딴짓을 감시합니다.
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setPreventSleep(!preventSleep);
                      showToast(!preventSleep ? '💤 아함! 수면 방지 모드를 장착하여 버디들이 졸지 않습니다!' : '💤 졸릴 땐 살짝 자게 수면 모드를 허락했습니다.');
                    }}
                    className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                      preventSleep ? 'bg-purple-600' : 'bg-stone-300 dark:bg-stone-750'
                    }`}
                  >
                    <div 
                      className={`w-4.5 h-4.5 bg-white rounded-full transition-transform duration-200 transform ${
                        preventSleep ? 'translate-x-5.5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Yarrr Time Button trigger - VIVID GRADIENT BUTTON */}
                <div className="pt-1">
                  <button
                    onClick={triggerYarrrTimeWaterfall}
                    className="w-full py-4.5 px-4 bg-gradient-to-r from-purple-500 via-[#7C3AED] to-indigo-500 hover:opacity-95 text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-black tracking-wider shadow-subtle-md cursor-pointer transition transform active:scale-98"
                  >
                    <Sparkles className="w-4.5 h-4.5 text-white animate-bounce" />
                    <span>🏴‍☠️ 야르~ 타임! (이모지 폭포 발사!)</span>
                  </button>
                  <span className="block text-[9px] text-center text-stone-400 mt-2 font-bold leading-normal">
                    이 버튼을 누르면 화면 한가득 다채로운 우주 행운 이모지들이 우수수 쏟아져 내립니다! 
                  </span>
                </div>

              </div>
            )}
          </div>

        </div>

        {/* Clean footer info */}
        <div className="p-4 border-t border-stone-150 dark:border-stone-850 text-center text-[10px] text-stone-400 font-bold bg-stone-50 dark:bg-stone-900/40">
          최애를 풀어놨습니다 v1.0.6 • Work Hate Club Edition
        </div>
      </div>

    </div>
  );
}
