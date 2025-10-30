"use client";
import React, { useState } from 'react';

export function NewsletterSignup() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    // Simulated async submit
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 900);
  }

  const t = {
    title: 'Stay in the loop — calmly',
    desc: 'A micro-letter (1–2 emails / month). Applied research distillations, tested protocols, tool iterations — zero fluff.',
    placeholder: 'Your email',
    button: loading ? '...' : submitted ? 'Subscribed ✓' : 'Subscribe',
    foot: 'No tracking · instant unsubscribe'
  } as const;

  return (
    <div className="relative">
      <h3 className="font-serif text-2xl font-semibold tracking-tight text-neutral-700 dark:text-neutral-50 mb-3">{t.title}</h3>
      <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 max-w-xl mb-6">{t.desc}</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg" noValidate>
        <input
          type="email"
          required
          placeholder={t.placeholder}
          className="flex-1 rounded-full border border-neutral-200 bg-white/90 px-5 py-2.5 text-sm text-neutral-600 shadow-sm outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-100 dark:focus:border-primary-700 dark:focus:ring-primary-800/40"
          disabled={submitted}
        />
        <button
          type="submit"
          disabled={submitted}
          className="rounded-full bg-primary-600 px-6 py-2.5 text-sm font-medium text-white shadow-[0_18px_32px_-24px_rgba(79,122,117,0.8)] transition hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-primary-500 dark:hover:bg-primary-400"
        >
          {t.button}
        </button>
      </form>
      <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">{t.foot}</p>
    </div>
  );
}
