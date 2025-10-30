"use client";
import React, { useEffect, useState } from 'react';

interface HeadingItem { id: string; title: string; }

export function MiniTOC({ containerSelector = 'article' }: { containerSelector?: string }) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const hs = Array.from(container.querySelectorAll('h2')) as HTMLHeadingElement[];
    const mapped = hs.map(h => ({ id: h.id || h.textContent?.toLowerCase().replace(/[^a-z0-9]+/g,'-') || '', title: h.textContent || '' }));
    // ensure ids
    mapped.forEach(m => { if (m.id && !document.getElementById(m.id)) return; });
    hs.forEach((h,i) => { if(!h.id) h.id = mapped[i].id; });
    setHeadings(mapped.filter(h=>h.id));

    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { rootMargin: '0px 0px -60% 0px', threshold: 0.1 });
    hs.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  }, [containerSelector]);

  if (!headings.length) return null;

  return (
    <nav aria-label="Table of contents" className="text-xs font-medium tracking-wide">
      <div className="uppercase text-[10px] text-neutral-500 dark:text-neutral-400 mb-2">ON THIS PAGE</div>
      <ul className="space-y-1">
        {headings.map(h => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block rounded px-2 py-1 leading-snug text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${active===h.id ? 'bg-primary-500/10 text-primary-700 dark:text-primary-300' : ''}`}
            >
              {h.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
