import {useSyncExternalStore} from 'react';
import type {Platform} from '../types';

export function detectPlatform(): Platform {
  // 빌드 때 첫 화면을 미리 그릴 때는 navigator가 없다(기본 Windows)
  if (typeof navigator === 'undefined') return 'windows';
  const ua = navigator.userAgent;
  if (/Android|iPhone|iPad|iPod/i.test(ua)) return 'mobile';
  if (/Macintosh|Mac OS X/i.test(ua)) {
    // 아이패드는 맥 UA를 보내지만 터치가 된다.
    return navigator.maxTouchPoints > 1 ? 'mobile' : 'mac';
  }
  return 'windows';
}

const subscribe = () => () => {};
const serverPlatform = (): Platform => 'windows';

/**
 * 접속한 기기: 기본은 Windows, 맥이면 mac, 폰·태블릿이면 mobile.
 * 미리 그려 둔 HTML(Windows 기준)과 맞춰 시작하고, 화면이 붙은 뒤에 실제 기기 값으로 바뀐다.
 */
export function usePlatform(): Platform {
  return useSyncExternalStore(subscribe, detectPlatform, serverPlatform);
}
