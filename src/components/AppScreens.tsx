import {SCREEN_FEATURES} from '../constants';
import {Section} from './Section';

const HOME_ALT =
  '최애를 풀어놨습니다 설정창 홈 화면. 오른쪽에 버디 미리보기, 왼쪽에 모드·크기·활동 구역 같은 설정 칩, 아래에 점심 알림과 퇴근 알림 카드가 있어요.';

export function AppScreens() {
  return (
    <Section
      id="screens"
      title="곧 나올 새 설정창을 미리 봐요"
      intro="아래 화면은 새 디자인(v1.1.0)이에요. 지금 받는 v1.0.9와는 설정창 모양이 달라요."
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
        <figure className="lg:col-span-8">
          {/* 라이트·다크 중 한쪽만 보이고, 숨은 쪽은 lazy라 받지 않는다 */}
          <img
            src="/screens/home-light.webp"
            width={1170}
            height={910}
            alt={HOME_ALT}
            loading="lazy"
            decoding="async"
            className="shot max-w-[720px] dark:hidden"
          />
          <img
            src="/screens/home-dark.webp"
            width={1170}
            height={910}
            alt={HOME_ALT}
            loading="lazy"
            decoding="async"
            className="shot hidden max-w-[720px] dark:block"
          />
        </figure>

        <div className="flex flex-col gap-8 lg:col-span-4">
          <ol className="flex flex-col gap-5">
            {SCREEN_FEATURES.map((item) => (
              <li key={item.title} className="flex flex-col gap-1">
                <h3 className="t-sub">{item.title}</h3>
                <p className="text-sub">{item.text}</p>
              </li>
            ))}
          </ol>
          <figure className="flex items-start gap-4">
            <img
              src="/screens/toast.webp"
              width={380}
              height={380}
              alt={'버디 위에 작은 말풍선으로 "퇴근 5분 전이에요!"라고 미리 알려 주는 모습'}
              loading="lazy"
              decoding="async"
              className="shot w-[132px] flex-none"
            />
            {/* TODO(copy): 이 캡션은 landing-copy.md에 없는 문구다. 카피 담당 확인 필요. */}
            <figcaption className="t-caption">
              미리 알림은 버디 위에 작은 말풍선으로 떠요. 미리 알림은 지금 버전에도 있어요.
            </figcaption>
          </figure>
        </div>

        <figure className="flex flex-col gap-3 lg:col-span-5">
          <img
            src="/screens/crop.webp"
            width={1170}
            height={910}
            alt="올린 사진을 원형 틀에 맞춰 자르는 창. 확대와 위치 조절, 원형·사각형 선택이 보여요."
            loading="lazy"
            decoding="async"
            className="shot"
          />
          <figcaption className="t-caption">내 사진은 원하는 모양으로 잘라서 올려요. 자르기는 지금 버전에도 있어요.</figcaption>
        </figure>
        <figure className="flex flex-col gap-3 lg:col-span-7">
          <img
            src="/screens/alert-leave.webp"
            width={1440}
            height={810}
            alt="화면 가운데에 버디와 퇴근 시각이 적힌 카드가 뜨고 주변에 이모지가 올라오는 모습."
            loading="lazy"
            decoding="async"
            className="shot"
          />
          <figcaption className="t-caption">정한 시각에 퇴근 알림이 화면에 떠요. 알림은 지금 버전에도 있어요.</figcaption>
        </figure>
      </div>
    </Section>
  );
}
