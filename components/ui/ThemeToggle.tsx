'use client';
import { useEffect, useState } from 'react';
import { Button } from './Button';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  // Sync initial state & listen for external changes (system or other tabs)
  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains('dark');
    setDark(isDark);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onMedia = (e: MediaQueryListEvent) => {
      const ls = localStorage.getItem('theme');
      if (!ls) { // Only auto-switch if user did not explicitly choose
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };
    media.addEventListener('change', onMedia);

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        applyTheme(e.newValue as 'dark' | 'light');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      media.removeEventListener('change', onMedia);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  function applyTheme(mode: 'dark' | 'light') {
    setDark(mode === 'dark');
    document.documentElement.classList.toggle('dark', mode === 'dark');
    document.documentElement.dataset.theme = mode;
  }

  if (!mounted) return null;
  return (
    <Button
      variant="outline"
      size="icon"
      className="h-11 w-11 border-neutral-200 bg-white/80 text-neutral-700 shadow-sm hover:border-primary-200 hover:bg-primary-50 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-100 dark:hover:border-primary-600 dark:hover:bg-neutral-800"
      onClick={() => {
        const next = dark ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem('theme', next); } catch {}
      }}
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
