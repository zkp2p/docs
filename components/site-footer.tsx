import Link from 'next/link';

import { footerSections } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        {footerSections.map((section) => (
          <div key={section.title} className="site-footer__column">
            <h2 className="site-footer__title">{section.title}</h2>
            <ul className="site-footer__list">
              {section.items.map((item) => {
                const external = item.href.startsWith('http') || item.href.startsWith('mailto:');

                return (
                  <li key={item.label}>
                    {external ? (
                      <a href={item.href} className="site-footer__link" target="_blank" rel="noreferrer">
                        {item.label}
                      </a>
                    ) : (
                      <Link href={item.href} className="site-footer__link">
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="site-footer__copyright">© {new Date().getFullYear()} P2P Labs Inc.</div>
    </footer>
  );
}
