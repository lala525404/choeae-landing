import {Eraser, ExternalLink, FileImage, HardDrive, Ruler} from 'lucide-react';
import {BUDDIES, FEATURE_LIST, PHOTO_TIPS, twemojiSrc} from '../constants';
import {Section} from './Section';

const TIP_ICONS = [FileImage, Ruler, HardDrive, Eraser];

export function Features() {
  return (
    <Section id="features" title="내 사진이 버디가 되고, 하루가 조금 가벼워져요">
      <div className="flex flex-col gap-12 lg:gap-16">
        {/* 내 사진이 버디가 돼요 */}
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-6">
          <div className="flex flex-col gap-3 lg:col-span-6">
            <h3 className="t-sub">내 사진이 버디가 돼요</h3>
            <p className="t-body">
              최애 사진이나 반려동물 사진을 올리면 그대로 내 화면을 돌아다니는 버디가 돼요. 올릴 때 원형이나 사각형으로
              자를 수 있고, 잘린 모양 그대로 화면에 나와요.
            </p>
            {/* TODO(확인 필요): 사진 → 버디 예시 이미지는 실제 사용 허락된 사진인지 확인된 뒤에 넣는다. */}
          </div>
          <div className="flex flex-col gap-3 lg:col-span-5 lg:col-start-8">
            <div className="panel px-5 py-2">
              <h4 className="sr-only">사진 준비 팁</h4>
              <ul>
                {PHOTO_TIPS.map((tip, index) => {
                  const Icon = TIP_ICONS[index];
                  return (
                    <li key={tip} className="flex items-center gap-3 border-t border-line py-3 first:border-t-0">
                      <Icon size={20} strokeWidth={1.5} className="flex-none text-sub" aria-hidden="true" />
                      {tip}
                    </li>
                  );
                })}
              </ul>
            </div>
            <a
              href="https://www.remove.bg"
              target="_blank"
              rel="noopener noreferrer"
              className="link inline-flex min-h-11 items-center gap-1 self-start"
            >
              remove.bg에서 배경 지우기
              <span className="sr-only">(새 창)</span>
              <ExternalLink size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* 동물 8종 */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-6">
          <div className="flex flex-col gap-3 lg:col-span-5">
            <h3 className="t-sub">동물 친구 8종</h3>
            <p className="t-body">
              사진이 없어도 괜찮아요. 고양이, 강아지, 토끼, 여우, 햄스터, 곰, 펭귄, 오리 중에서 골라요.
            </p>
          </div>
          <ul className="grid grid-cols-4 gap-x-4 gap-y-5 lg:col-span-7 lg:grid-cols-8 lg:gap-x-3">
            {BUDDIES.map((buddy) => (
              <li key={buddy.id} className="flex flex-col items-center gap-2">
                <img
                  src={twemojiSrc(buddy.code)}
                  width={64}
                  height={64}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="size-12 md:size-14"
                />
                <span className="t-caption">{buddy.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 줄 목록 */}
        <dl className="border-b border-line">
          {FEATURE_LIST.map((feature) => (
            <div key={feature.title} className="grid gap-1 border-t border-line py-5 lg:grid-cols-12 lg:gap-6">
              <dt className="t-sub lg:col-span-4">{feature.title}</dt>
              <dd className="t-body lg:col-span-8">{feature.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
