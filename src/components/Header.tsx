import {NAV_LINKS, PRODUCT_NAME} from '../constants';
import {ThemeToggle} from './ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-win">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-3 px-5 md:px-8">
        <a
          href="#top"
          aria-label={`${PRODUCT_NAME} 처음으로`}
          className="whitespace-nowrap font-logo text-[20px] leading-none text-ink"
        >
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
          {/* 헤더는 모든 화면에 같이 보이므로 항상 회색 버튼 */}
          <a href="#download" className="btn btn-sm hidden xs:inline-flex">
            다운로드
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
