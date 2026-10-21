import {Download} from 'lucide-react';
import {DOWNLOADS, downloadLabel, type DownloadOS} from '../constants';
import {usePlatform} from '../hooks/usePlatform';

interface DownloadButtonsProps {
  align?: 'start' | 'center';
}

function DownloadLink({os, primary}: {os: DownloadOS; primary: boolean}) {
  return (
    <a href={DOWNLOADS[os].url} download className={primary ? 'btn btn-primary' : 'btn'}>
      <Download size={18} strokeWidth={1.5} aria-hidden="true" />
      {downloadLabel(os)}
    </a>
  );
}

/**
 * 접속 OS에 맞는 쪽만 채운 버튼(기본 Windows, 맥이면 macOS), 다른 쪽은 회색.
 * 폰·태블릿이면 둘 다 회색이고 컴퓨터에서 받으라는 안내를 붙인다.
 */
export function DownloadButtons({align = 'start'}: DownloadButtonsProps) {
  const platform = usePlatform();
  const centered = align === 'center';

  return (
    <div className="flex flex-col gap-3">
      <div className={`flex flex-col gap-3 sm:flex-row sm:items-start ${centered ? 'sm:justify-center' : ''}`}>
        <DownloadLink os="windows" primary={platform === 'windows'} />
        <div className={`flex flex-col gap-2 ${centered ? 'items-stretch sm:items-center' : 'items-stretch sm:items-start'}`}>
          <DownloadLink os="mac" primary={platform === 'mac'} />
          <p className="t-caption px-1">{DOWNLOADS.mac.note}</p>
          {DOWNLOADS.mac.soon && <p className="t-caption px-1">{DOWNLOADS.mac.soon}</p>}
        </div>
      </div>
      {platform === 'mobile' && <p className={`t-caption ${centered ? 'text-center' : ''}`}>컴퓨터에서 받아 주세요</p>}
    </div>
  );
}
