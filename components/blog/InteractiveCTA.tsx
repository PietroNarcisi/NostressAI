"use client";
import React from 'react';
import Link from 'next/link';

interface InteractiveCTAProps {
  slug: string; // interactive slug
}

export function InteractiveCTA({ slug }: InteractiveCTAProps) {
  return (
    <div className="mt-12 mb-8 not-prose">
      <Link
        href={`/interactive/${slug}`}
        className="group block relative overflow-hidden rounded-xl border border-primary-500/30 bg-gradient-to-br from-primary-600/15 via-teal-500/10 to-sky-500/10 dark:from-primary-500/25 dark:via-teal-500/15 p-6 md:p-7 backdrop-blur-sm hover:border-primary-500 transition-colors"
      >
        <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-[opacity] bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.7),transparent_60%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="h-14 w-14 rounded-lg bg-primary-600/80 dark:bg-primary-500/70 text-white flex items-center justify-center text-xl font-semibold shadow-md ring-4 ring-primary-500/30 group-hover:scale-105 transition-transform">✦</div>
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400 mb-1">Interactive version</p>
            <h3 className="text-lg font-semibold mb-1 leading-snug">Explore this topic in an immersive format</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">Jump into charts, thematic tabs, and extended data designed to deepen the article.</p>
          </div>
          <div className="text-sm font-medium text-primary-600 dark:text-primary-400 whitespace-nowrap flex items-center gap-1">
            Open <span aria-hidden>→</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
