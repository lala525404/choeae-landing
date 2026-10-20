import {useCallback, useEffect, useState} from 'react';
import {THEME_STORAGE_KEY} from '../constants';
import type {ThemePref} from '../types';

/** 버튼을 누를 때마다 라이트 → 다크 → 시스템 순서로 돈다. */
const ORDER: ThemePref[] = ['light', 'dark', 'system'];

export const THEME_LABEL: Record<ThemePref, string> = {
  light: '라이트',
  dark: '다크',
  system: '시스템',
};

function readPref(): ThemePref {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : 'system';
  } catch {
    return 'system';
  }
}

function resolve(pref: ThemePref): 'light' | 'dark' {
  if (pref !== 'system') return pref;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [pref, setPref] = useState<ThemePref>(readPref);

  useEffect(() => {
    document.documentElement.dataset.theme = resolve(pref);
  }, [pref]);

  const next = ORDER[(ORDER.indexOf(pref) + 1) % ORDER.length];

  const cycle = useCallback(() => {
    setPref(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // 저장이 막혀 있어도 이번 방문에서는 바뀐다.
    }
  }, [next]);

  return {pref, next, cycle};
}
