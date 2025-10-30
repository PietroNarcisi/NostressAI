"use client";
import React, { useState } from 'react';
import clsx from 'clsx';

interface InteractiveLayoutProps {
  tabs: { id: string; label: string }[];
  children: React.ReactNode;
}
export function InteractiveLayout({ tabs, children }: InteractiveLayoutProps) {
  const [active, setActive] = useState(tabs[0]?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <nav className="flex flex-wrap justify-center items-center gap-2 md:gap-3 mb-10 bg-white dark:bg-neutral-900 p-2 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-800">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={clsx('nav-pill text-sm md:text-base px-4 py-2 rounded-full font-medium transition', active === t.id ? 'bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300')}
            aria-pressed={active===t.id}
          >{t.label}</button>
        ))}
      </nav>
      <div>
        {React.Children.map(children, child => {
          if (!React.isValidElement(child)) return child;
          const id = (child.props as any).id;
          const isActive = id === active;
          return (
            <div
              role="tabpanel"
              aria-labelledby={id}
              style={{ display: isActive ? 'block' : 'none' }}
              data-tab-panel={id}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
}
