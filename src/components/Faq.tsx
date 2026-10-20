import {ChevronDown} from 'lucide-react';
import {FAQ_ITEMS} from '../constants';
import {RichText} from '../lib/RichText';
import {Section} from './Section';

export function Faq() {
  return (
    <Section id="faq" title="자주 묻는 질문">
      <div className="max-w-[720px] border-b border-line">
        {FAQ_ITEMS.map((item) => (
          <details key={item.question} className="border-t border-line">
            <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-3 font-semibold">
              {item.question}
              <ChevronDown size={20} strokeWidth={1.5} className="faq-chevron flex-none text-sub" aria-hidden="true" />
            </summary>
            <div className="t-body flex flex-col gap-3 pb-5 text-sub">
              {item.answer.map((paragraph) => (
                <p key={paragraph}>
                  <RichText text={paragraph} />
                </p>
              ))}
            </div>
          </details>
        ))}
      </div>
    </Section>
  );
}
