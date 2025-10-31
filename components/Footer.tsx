import Link from 'next/link';

const primaryLinks = [
  { href: '/approach', label: 'Approach' },
  { href: '/courses', label: 'Courses' },
  { href: '/blog', label: 'Blog' },
  { href: '/videos', label: 'Videos' }
];

const supportLinks = [
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-neutral-100/80 bg-neutral-25/90 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-900/70">
      <div className="site-container px-4 py-14 text-sm text-neutral-500 dark:text-neutral-400">
        <div className="grid gap-10 md:grid-cols-[1.25fr_1fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-600 dark:text-primary-400">NoStress AI</p>
            <p className="mt-4 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-200">
              Holistic stress relief for modern families. We blend neuroscience, mindful routines, and intentional AI tools so you can build calmer systems at home and work.
            </p>
          </div>
          <nav aria-labelledby="footer-site-nav">
            <p id="footer-site-nav" className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-300">
              Explore
            </p>
            <ul className="mt-4 space-y-3">
              {primaryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary-600 dark:hover:text-primary-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-labelledby="footer-support-nav">
            <p id="footer-support-nav" className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-300">
              Support
            </p>
            <ul className="mt-4 space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary-600 dark:hover:text-primary-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="mailto:care@nostress.ai"
                  className="transition-colors hover:text-primary-600 dark:hover:text-primary-300"
                >
                  care@nostress.ai
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-neutral-100/70 pt-6 text-xs text-neutral-500 dark:border-neutral-800/60 dark:text-neutral-400 md:flex-row md:items-center md:justify-between">
          <p>© {year} NoStress AI. All rights reserved.</p>
          <p className="text-neutral-400 dark:text-neutral-500">Built with intention, backed by research, made for calmer days.</p>
        </div>
      </div>
    </footer>
  );
}
