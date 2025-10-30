"use client";
import { useEffect, useState } from 'react';

interface HeadingItem { depth: number; text: string; slug: string }

export function ActiveTOC({ headings }: { headings: HeadingItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(e.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -65% 0px', threshold: [0, 1] }
    );

    const targets = headings.map(h => document.getElementById(h.slug)).filter(Boolean) as HTMLElement[];
    targets.forEach(t => observer.observe(t));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="text-xs font-medium tracking-wide">
      <div className="uppercase text-[10px] text-neutral-500 dark:text-neutral-400 mb-2">ON THIS PAGE</div>
      <ul className="space-y-1">
        {headings
          .filter((h) => h.depth <= 3)
          .map((h) => {
            const isActive = active === h.slug;
            return (
              <li key={h.slug} className={h.depth === 3 ? 'pl-3' : ''}>
                <a
                  href={`#${h.slug}`}
                  className={`block rounded px-2 py-1 leading-snug text-neutral-600 dark:text-neutral-300 transition-colors hover:text-primary-600 dark:hover:text-primary-400 ${isActive ? 'bg-primary-500/10 text-primary-700 dark:text-primary-300' : ''}`}
                >
                  {h.text}
                </a>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
