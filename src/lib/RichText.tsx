import {Fragment, type ReactNode} from 'react';

const TOKEN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

/** 문구 데이터용 작은 표기: **굵게**, [글자](주소). 바깥 주소는 새 탭에서 연다. */
export function RichText({text}: {text: string}) {
  const nodes: ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(text.slice(last, index));
    if (match[1] !== undefined) {
      nodes.push(<strong key={index} className="font-semibold">{match[1]}</strong>);
    } else {
      const href = match[3];
      const external = /^https?:/.test(href);
      nodes.push(
        <a
          key={index}
          href={href}
          className="link"
          {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
        >
          {match[2]}
        </a>,
      );
    }
    last = index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));

  return <Fragment>{nodes}</Fragment>;
}
