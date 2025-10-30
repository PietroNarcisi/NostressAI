import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-neutral-100/80 bg-neutral-25/90 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-900/70">
      <div className="site-container flex flex-col gap-6 px-4 py-10 text-sm text-neutral-500 dark:text-neutral-400 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-neutral-600 dark:text-neutral-200">NoStress AI</p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Calm systems for lighter cognitive load.</p>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/mentions-legales" className="transition-colors hover:text-primary-600 dark:hover:text-primary-300">
            Legal (FR)
          </Link>
          <Link href="/confidentialite" className="transition-colors hover:text-primary-600 dark:hover:text-primary-300">
            Privacy (FR)
          </Link>
        </nav>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 md:text-right">© {year} NoStress AI. All rights reserved.</p>
      </div>
    </footer>
  );
}
