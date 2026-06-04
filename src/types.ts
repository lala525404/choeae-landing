export type BuddyCharacter = 'cat' | 'dog' | 'rabbit' | 'fox' | 'hamster' | 'bear' | 'penguin' | 'duck' | 'custom';

export interface BuddyConfig {
  id: BuddyCharacter;
  name: string;
  emoji: string;
  color: string;
  bgClass: string;
  borderClass: string;
  accentColor: string;
  description: string;
}

export type BuddyVelocity = 'slow' | 'normal' | 'fast';

export interface StateBuddy {
  id: string;
  character: BuddyCharacter;
  customImageUrl?: string;
  customEmoji?: string;
  customName?: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  scaleX: number; // For mirroring (1 or -1)
  status: 'walk' | 'sleep' | 'wall' | 'teleport' | 'idle';
  speechText: string;
  speechTimer: number; // ms left to show speech
  speechColor: string; // Tailwind bg class for balloon
  animationTimer: number; // for general status transition
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  emoji: string;
  vx: number;
  vy: number;
  scale: number;
  opacity: number;
  life: number; // 0 to 1
}

export interface ReleaseNote {
  version: string;
  date: string;
  title: string;
  badge?: string;
  additions: string[];
  fixes?: string[];
  type: 'major' | 'minor' | 'patch';
}

export interface FAQItem {
  question: string;
  answer: string;
}
