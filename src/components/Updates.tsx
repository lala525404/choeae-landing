import {useState} from 'react';
import {DOWNLOADS, RELEASE_NOTES} from '../constants';
import {Section} from './Section';

const FOLDED_LIST_ID = 'updates-folded';

export function Updates() {
  const [expanded, setExpanded] = useState(false);
  const shown = RELEASE_NOTES.filter((note) => !note.folded);
  const folded = RELEASE_NOTES.filter((note) => note.folded);

  const renderNote = (note: (typeof RELEASE_NOTES)[number]) => (
    <li key={note.version} className="grid gap-3 border-t border-line py-6 md:grid-cols-[148px_minmax(0,1fr)] md:gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h3 className="t-sub num">{note.version}</h3>
          {note.latest && (
            <span className="rounded-full bg-track px-2 py-0.5 text-[12px] font-semibold leading-snug">최신</span>
          )}
        </div>
        {note.date && <p className="t-caption num">{note.date}</p>}
      </div>
      <div className="flex flex-col gap-4">
        {note.title && <p className="font-semibold">{note.title}</p>}
        {note.groups.map((group, index) => (
          <div key={group.label ?? index} className="flex flex-col gap-2">
            {group.label && <p className="t-caption">{group.label}</p>}
            <ul className="t-body flex list-disc flex-col gap-1 pl-5 marker:text-sub">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
        {note.note && <p className="t-caption">{note.note}</p>}
      </div>
    </li>
  );

  return (
    <Section
      id="updates"
      title="업데이트 내역"
      intro="지금까지 나온 버전을 모았어요. 새 소식은 여기에 먼저 적을게요."
    >
      <div className="flex max-w-[720px] flex-col gap-4">
        <p className="t-caption">
          Windows는 v{DOWNLOADS.windows.version}, macOS는 v{DOWNLOADS.mac.version}까지 받을 수 있어요.
        </p>
        <div>
          <ol className="border-b border-line">{shown.map(renderNote)}</ol>
          <ol id={FOLDED_LIST_ID} hidden={!expanded}>
            {folded.map(renderNote)}
          </ol>
        </div>
        <button
          type="button"
          className="btn self-start"
          aria-expanded={expanded}
          aria-controls={FOLDED_LIST_ID}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? '이전 버전 접기' : '이전 버전 더 보기'}
        </button>
      </div>
    </Section>
  );
}
