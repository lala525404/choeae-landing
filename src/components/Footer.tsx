import {CONTACT_HREF, PRODUCT_NAME} from '../constants';

const LINKS = [
  {href: '/privacy.html', label: '개인정보처리방침'},
  {href: '/terms.html', label: '이용약관'},
  {href: '/about.html', label: '서비스 소개'},
  {href: '/faq.html', label: 'FAQ'},
  {href: CONTACT_HREF, label: '문의'},
];

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-6 px-5 md:px-8">
        <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
          <div className="flex flex-col gap-1 lg:col-span-5">
            <p className="font-logo text-[20px] leading-tight">{PRODUCT_NAME}</p>
            <p className="t-caption num">© 2026 Lara Park</p>
          </div>
          <nav aria-label="사이트 정보" className="lg:col-span-7">
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="link-quiet inline-flex min-h-11 items-center whitespace-nowrap text-[14px]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="t-caption">
          버디 이미지: Twemoji © Twitter, Inc. and other contributors ·{' '}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="link-quiet"
          >
            CC BY 4.0
          </a>
        </p>
      </div>
    </footer>
  );
}
