import {useRef, useState, type KeyboardEvent} from 'react';
import {DOWNLOADS, MAC_STEPS, WINDOWS_STEPS, fileLinkLabel} from '../constants';
import {usePlatform} from '../hooks/usePlatform';
import {RichText} from '../lib/RichText';
import type {InstallStep} from '../types';
import {Section} from './Section';

type Tab = 'windows' | 'mac';

const TABS: {id: Tab; label: string}[] = [
  {id: 'windows', label: 'Windows'},
  {id: 'mac', label: 'macOS'},
];

function Steps({steps}: {steps: InstallStep[]}) {
  return (
    <ol className="border-b border-line">
      {steps.map((step, index) => (
        <li key={step.title} className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-2 border-t border-line py-5">
          <span className="num font-semibold text-sub">{index + 1}</span>
          <div className="flex flex-col gap-1">
            <h3 className="t-sub">{step.title}</h3>
            <p className="t-body">
              <RichText text={step.text} />
            </p>
            {step.download && (
              <a
                href={DOWNLOADS[step.download].url}
                download
                className="link inline-flex min-h-11 items-center self-start"
              >
                {fileLinkLabel(step.download)}
              </a>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Install() {
  const platform = usePlatform();
  const [tab, setTab] = useState<Tab>(platform === 'mac' ? 'mac' : 'windows');
  const buttons = useRef<Record<Tab, HTMLButtonElement | null>>({windows: null, mac: null});

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const next: Tab = tab === 'windows' ? 'mac' : 'windows';
    setTab(next);
    buttons.current[next]?.focus();
  };

  return (
    <Section id="install" title="설치는 금방 끝나요">
      <div className="flex max-w-[720px] flex-col gap-6">
        <div role="tablist" aria-label="운영체제 선택" className="seg w-full sm:w-80" onKeyDown={onKeyDown}>
          {TABS.map(({id, label}) => (
            <button
              key={id}
              ref={(node) => {
                buttons.current[id] = node;
              }}
              type="button"
              role="tab"
              id={`install-tab-${id}`}
              aria-selected={tab === id}
              aria-controls={`install-panel-${id}`}
              tabIndex={tab === id ? 0 : -1}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`install-panel-${tab}`}
          aria-labelledby={`install-tab-${tab}`}
          className="flex flex-col gap-4"
        >
          {tab === 'mac' && (
            <p className="font-semibold">Apple Silicon(M1 이후) 전용이에요. 인텔 맥은 아직 지원하지 않아요.</p>
          )}
          <Steps steps={tab === 'windows' ? WINDOWS_STEPS : MAC_STEPS} />
          {/* macOS가 Windows보다 늦는 동안만 쓰는 안내. 두 버전이 같아지면 지운다. */}
          {tab === 'mac' && (
            <p className="t-caption">
              macOS용 v{DOWNLOADS.windows.version}는 준비 중이에요. 당분간 v{DOWNLOADS.mac.version}을 써 주세요.
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}
