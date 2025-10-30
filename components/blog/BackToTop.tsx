"use client";
import { useEffect, useState } from 'react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/70 backdrop-blur shadow-md hover:bg-white dark:hover:bg-neutral-800 transition-colors flex items-center justify-center text-lg"
      aria-label="Back to top"
    >
      ↑
    </button>
  );
}
