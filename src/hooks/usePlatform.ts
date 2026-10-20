import {useState} from 'react';
import type {Platform} from '../types';

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/Android|iPhone|iPad|iPod/i.test(ua)) return 'mobile';
  if (/Macintosh|Mac OS X/i.test(ua)) {
    // 아이패드는 맥 UA를 보내지만 터치가 된다.
    return navigator.maxTouchPoints > 1 ? 'mobile' : 'mac';
  }
  return 'windows';
}

/** 접속한 기기: 기본은 Windows, 맥이면 mac, 폰·태블릿이면 mobile */
export function usePlatform(): Platform {
  const [platform] = useState(detectPlatform);
  return platform;
}
