import {Check} from 'lucide-react';
import {PRODUCT_NAME} from '../constants';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {BuddyStage} from './BuddyStage';
import {DownloadButtons} from './DownloadButtons';

const TRUST_LINES = ['앱 안에는 광고가 없어요.', '내 사진과 설정은 내 컴퓨터에만 저장돼요.'];

export function Hero() {
  const reduced = useReducedMotion();
  return (
    <section className="pb-9 pt-9 md:pt-12 lg:pb-[60px] lg:pt-[72px]">
      <div className="mx-auto grid max-w-[1120px] gap-8 px-5 md:px-8 lg:grid-cols-12 lg:items-center lg:gap-6">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <div className="flex flex-col gap-4">
            <h1 className="t-hero max-w-[18em]">{PRODUCT_NAME}</h1>
            {/* 히어로 문구는 landing-copy.md의 A안 */}
            <p className="t-lead max-w-[30em] text-sub">
              내 최애 사진이 화면 위를 돌아다녀요. 일하기 싫은 날엔 퇴근 알림도 챙겨 줘요.
            </p>
          </div>
          <DownloadButtons />
          <ul className="flex flex-col gap-1 text-[14px] text-sub">
            {TRUST_LINES.map((line) => (
              <li key={line} className="flex items-start gap-2">
                <Check size={18} strokeWidth={1.5} className="mt-[3px] flex-none" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <figure className="flex flex-col gap-2 lg:col-span-5">
          <div className="panel p-2">
            <BuddyStage />
          </div>
          {!reduced && <figcaption className="t-caption px-1">버디를 눌러 보세요. 폴짝 뛰어요.</figcaption>}
        </figure>
      </div>
    </section>
  );
}
