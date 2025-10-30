'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { Button } from './Button';
import { Menu, X } from 'lucide-react';

interface MobileMenuProps {
  links: { href: string; label: string }[];
}

export function MobileMenu({ links }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // presence for exit animation
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Prevent body scroll when menu open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = original; };
    }
  }, [open]);

  // Handle presence for exit animation
  useEffect(() => {
    if (open) {
      setMounted(true);
    } else if (mounted) {
      const t = setTimeout(() => setMounted(false), 180); // must match animation duration
      return () => clearTimeout(t);
    }
  }, [open, mounted]);

  // Focus & keyboard (Escape + simple trap)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    if (open) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => firstLinkRef.current?.focus());
      window.addEventListener('keydown', onKey);
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      if (!open) previouslyFocusedRef.current?.focus?.();
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      {mounted && (
        <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Mobile navigation menu">
          {/* Dimmed background with fade */}
          <div
            className={cn(
              'absolute inset-0 bg-neutral-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-200',
              open ? 'opacity-100' : 'opacity-0'
            )}
            onClick={() => setOpen(false)}
          />
          {/* Panel with slide + slight scale */}
          <div
            className={cn(
              'absolute inset-x-0 top-0 p-4 pt-20 min-h-full flex flex-col gap-3 shadow-lg border-b border-neutral-200 dark:border-neutral-800',
              'bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md transition-all duration-200 ease-out',
              open ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
            )}
          >
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 h-10 w-10 inline-flex items-center justify-center rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/70 backdrop-blur hover:bg-white/90 dark:hover:bg-neutral-800/80 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex flex-col gap-2">
              {links.map((l, idx) => (
                <Link
                  key={l.href}
                  href={l.href}
                  ref={idx === 0 ? firstLinkRef : undefined}
                  className="rounded-md px-4 py-3 text-base font-medium tracking-wide text-neutral-800 dark:text-neutral-100 bg-neutral-100/60 dark:bg-neutral-800/60 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/60"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="mt-auto pt-8 text-xs text-neutral-500 dark:text-neutral-400">
              <p>© {new Date().getFullYear()} NoStress AI</p>
              <button
                onClick={() => setOpen(false)}
                className="mt-4 underline decoration-dotted text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
