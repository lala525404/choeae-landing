import {Download, Menu, X} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';
import {NAV_LINKS, PRODUCT_NAME} from '../constants';
import {HeartMark} from './HeartMark';
import {ThemeToggle} from './ThemeToggle';

const MENU_ID = 'mobile-menu';

export function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  // Esc로 닫고 포커스를 메뉴 버튼으로 돌려준다.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      menuButton.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // 화면이 넓어져 데스크톱 메뉴가 보이면 모바일 메뉴는 닫는다.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const close = () => {
      if (query.matches) setOpen(false);
    };
    query.addEventListener('change', close);
    return () => query.removeEventListener('change', close);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-win">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-2 px-5 md:px-8">
        <a
          href="#top"
          aria-label={`${PRODUCT_NAME} 처음으로`}
          className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap font-logo text-[20px] leading-none text-ink"
        >
          <HeartMark className="h-[18px] w-[19px]" />
          {PRODUCT_NAME}
        </a>
        <nav aria-label="주요 메뉴" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex h-11 items-center whitespace-nowrap px-3 text-[14px] font-semibold text-sub hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          {/* 헤더는 모든 화면에 같이 보이므로 항상 회색 버튼. 아주 좁은 화면에서는 아이콘만 남긴다. */}
          <a href="#download" className="btn btn-sm hidden xs:inline-flex">
            다운로드
          </a>
          <a href="#download" className="icon-btn xs:hidden" aria-label="다운로드">
            <Download size={20} strokeWidth={1.5} aria-hidden="true" />
          </a>
          <ThemeToggle />
          <button
            ref={menuButton}
            type="button"
            className="icon-btn md:hidden"
            aria-expanded={open}
            aria-controls={MENU_ID}
            aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X size={20} strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Menu size={20} strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      <nav id={MENU_ID} aria-label="모바일 메뉴" hidden={!open} className="border-t border-line bg-win md:hidden">
        <ul className="mx-auto max-w-[1120px] px-5 py-2">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="flex min-h-12 items-center text-[15px] font-semibold"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
