"use client";
import React, { useState } from 'react';

interface PreCodeProps {
  children: any;
}

export function PreCode(props: PreCodeProps) {
  const [copied, setCopied] = useState(false);
  const child: any = props.children;
  const className: string = child?.props?.className || '';
  const langMatch = className.match(/language-([a-z0-9]+)/i) || className.match(/lang-(\w+)/i);
  const lang = langMatch ? langMatch[1].toLowerCase() : undefined;

  function handleCopy() {
    const text = typeof child === 'string' ? child : (child?.props?.children || '');
    navigator.clipboard.writeText(String(text)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }).catch(() => {});
  }

  return (
    <div className="group relative">
      {lang && (
        <span className="absolute left-2 top-2 z-10 rounded-md bg-neutral-800/80 dark:bg-neutral-700/70 backdrop-blur px-2 py-0.5 text-[10px] tracking-wide uppercase text-neutral-200 dark:text-neutral-100 font-medium">
          {lang}
        </span>
      )}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Code copied' : 'Copy code'}
        className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all absolute top-2 right-2 text-[11px] rounded-md px-2 py-1 bg-neutral-800/85 dark:bg-neutral-700/80 backdrop-blur text-white dark:text-neutral-50 hover:bg-neutral-700 dark:hover:bg-neutral-600 flex items-center gap-1"
      >
        {copied ? 'Copied ✓' : 'Copy'}
      </button>
      <pre {...props} />
    </div>
  );
}
