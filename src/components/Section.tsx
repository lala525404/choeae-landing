import type {ReactNode} from 'react';

interface SectionProps {
  id?: string;
  title?: string;
  /** 제목 아래 한 줄 설명 */
  intro?: ReactNode;
  children: ReactNode;
}

/** 컨테이너 1120px, 좌우 20/32px, 위·아래 36/60px씩(인접 섹션 사이 72/120px) */
export function Section({id, title, intro, children}: SectionProps) {
  return (
    <section id={id} className="scroll-mt-16 py-9 lg:py-[60px]" aria-labelledby={id && title ? `${id}-title` : undefined}>
      <div className="mx-auto max-w-[1120px] px-5 md:px-8">
        {title && (
          <div className="mb-6 flex flex-col gap-3 lg:mb-8">
            <h2 id={id ? `${id}-title` : undefined} className="t-section">
              {title}
            </h2>
            {intro && <p className="t-body text-sub">{intro}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
