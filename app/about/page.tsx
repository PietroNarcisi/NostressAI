import type { Metadata } from 'next';
import { ArticleShell } from '@/components/layout/ArticleShell';
import { MiniTOC } from '@/components/ui/MiniTOC';
import { NewsletterSignup } from '@/components/ui/NewsletterSignup';
import React from 'react';

export const metadata: Metadata = {
  title: 'About | NoStress AI',
  description: 'NoStress AI manifesto – intentional AI, cognitive sobriety, clarity and human rhythms.',
  alternates: {
    canonical: 'https://www.nostress.ai/about'
  },
  openGraph: {
    type: 'article',
    title: 'About | NoStress AI',
    description: 'NoStress AI manifesto – intentional AI, cognitive sobriety, clarity and human rhythms.',
    url: 'https://www.nostress.ai/about'
  }
};

export default function AboutPage() {
  const breadcrumb = (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap gap-1 text-neutral-500 dark:text-neutral-400">
        <li><a href="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</a></li>
        <li className="opacity-50">/</li>
        <li aria-current="page" className="font-medium text-neutral-700 dark:text-neutral-300">About</li>
      </ol>
    </nav>
  );

  return (
    <ArticleShell breadcrumb={breadcrumb} toc={<MiniTOC containerSelector="#about-article" />}>
      <header className="mb-16" data-fade-section>
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400 mb-4">Manifesto</p>
        <h1 className="text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight mb-6 bg-gradient-to-r from-primary-500 via-teal-500 to-sky-500 bg-clip-text text-transparent">
          About NoStress AI
        </h1>
        <p className="text-xl md:text-2xl leading-relaxed text-neutral-700 dark:text-neutral-200 max-w-3xl font-light">
          Cognitive clarity. Human rhythms. Intentional AI. We help design lean systems that lighten the mind instead of cluttering it.
        </p>
      </header>

      <article id="about-article" className="prose prose-neutral dark:prose-invert max-w-none text-[1.125rem] leading-relaxed md:text-[1.17rem] md:leading-[1.75]">
        <section id="why" className="scroll-mt-28" data-fade-section>
          <h2 className="text-3xl tracking-tight font-semibold">Why this project?</h2>
          <p className="first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:leading-[0.9] first-letter:mr-3 first-letter:mt-1 first-letter:text-primary-500 dark:first-letter:text-primary-400">
            We observe the same paradox daily: powerful tools meant to simplify life end up saturating attention, fragmenting focus, and creating ambient inadequacy. NoStress AI emerged as a crafted response to automation overload.
          </p>
          <p>
            We advocate an <strong>anti-noise</strong> approach: fewer apps, more <em>light cognitive rituals</em>. AI becomes context assistance, not an endless stream of micro-interruptions.
          </p>
          <div className="not-prose my-12 grid gap-6 md:grid-cols-3">
            <div className="p-6 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 shadow-sm">
              <h3 className="text-[11px] font-semibold tracking-wide uppercase text-primary-600 dark:text-primary-400 mb-2">Compass</h3>
              <p className="text-sm leading-relaxed">Clarity, cognitive sobriety, attention ecology.</p>
            </div>
            <div className="p-6 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 shadow-sm">
              <h3 className="text-[11px] font-semibold tracking-wide uppercase text-primary-600 dark:text-primary-400 mb-2">We avoid</h3>
              <p className="text-sm leading-relaxed">Toxic hustle, tool stacking, anxious hyper-optimization.</p>
            </div>
            <div className="p-6 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 shadow-sm">
              <h3 className="text-[11px] font-semibold tracking-wide uppercase text-primary-600 dark:text-primary-400 mb-2">Filter</h3>
              <p className="text-sm leading-relaxed">A technique must reduce perceived friction, not create cognitive debt.</p>
            </div>
          </div>
        </section>

        <section id="principles" className="scroll-mt-28" data-fade-section>
          <h2 className="text-3xl tracking-tight font-semibold">Operating principles</h2>
          <ol className="marker:font-medium marker:text-primary-500 dark:marker:text-primary-400">
            <li><strong>Deliberate constraint</strong> – boundaries that stabilize the mind.</li>
            <li><strong>Healthy externalization</strong> – delegate logistical memory, preserve conceptual memory.</li>
            <li><strong>Biological rhythms</strong> – breath, ultradian recovery, calibrated load.</li>
            <li><strong>Transparency</strong> – no miracles, only testable protocols.</li>
          </ol>
        </section>

        <section id="what-we-produce" className="scroll-mt-28" data-fade-section>
          <h2 className="text-3xl tracking-tight font-semibold">What we produce</h2>
          <ul className="space-y-1">
            <li>Deep articles (stress, focus, assisted cognition).</li>
            <li>Structured training for applied practice.</li>
            <li>Pruned AI guides (intentional prompting, micro-systems).</li>
            <li>Experiments & reproducible frameworks.</li>
          </ul>
        </section>

        <section id="timeline" className="scroll-mt-28" data-fade-section>
          <h2 className="text-3xl tracking-tight font-semibold">Brief timeline</h2>
          <div className="not-prose relative pl-8 my-10">
            <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/60 via-neutral-300/40 dark:via-neutral-700/40 to-transparent" />
            <ul className="space-y-7">
              <li className="relative"><span className="absolute -left-[26px] top-1.5 h-3 w-3 rounded-full bg-primary-500 ring-4 ring-primary-500/25" /><p className="text-sm font-mono text-neutral-500 dark:text-neutral-400">2024 · Ideation & pilot workshops</p></li>
              <li className="relative"><span className="absolute -left-[26px] top-1.5 h-3 w-3 rounded-full bg-primary-500 ring-4 ring-primary-500/25" /><p className="text-sm font-mono text-neutral-500 dark:text-neutral-400">2025 Q1 · First modules formalized</p></li>
              <li className="relative"><span className="absolute -left-[26px] top-1.5 h-3 w-3 rounded-full bg-primary-500 ring-4 ring-primary-500/25" /><p className="text-sm font-mono text-neutral-500 dark:text-neutral-400">2025 Q3 · Public platform launch</p></li>
            </ul>
          </div>
        </section>

        <section id="position" className="scroll-mt-28" data-fade-section>
          <h2 className="text-3xl tracking-tight font-semibold">Our stance on AI</h2>
          <p>AI is not an infinite cognitive shortcut: it is an amplifier. Ill-framed it feeds proactive anxiety. Well-framed it becomes a calm mental exoskeleton.</p>
          <blockquote className="border-l-4 border-primary-500/60 dark:border-primary-400/60 bg-gradient-to-r from-primary-500/5 to-transparent py-2 pl-5">
            Building a sustainable relationship with AI means accepting not to automate everything, keeping a human texture in identity-shaping processes.
          </blockquote>
        </section>

        <section id="audience" className="scroll-mt-28" data-fade-section>
          <h2 className="text-3xl tracking-tight font-semibold">Who is this for?</h2>
          <p>Those seeking antifragile attention capacity, fewer burnout cycles, and AI in service of a viable tempo.</p>
        </section>

        <section id="newsletter" className="scroll-mt-32" data-fade-section>
          <div className="not-prose relative overflow-hidden rounded-2xl border border-primary-500/25 bg-gradient-to-br from-primary-600/15 via-teal-500/10 to-sky-500/10 dark:from-primary-500/20 dark:via-teal-500/15 p-8 md:p-10">
            <div className="absolute inset-0 [mask-image:radial-gradient(circle_at_30%_35%,black,transparent)] opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.4),transparent_60%)] dark:opacity-30" />
            <div className="relative">
              <NewsletterSignup />
            </div>
          </div>
        </section>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About NoStress AI',
            url: 'https://www.nostress.ai/about',
            inLanguage: 'en',
            description: 'NoStress AI manifesto – intentional AI, cognitive sobriety and attention ecology.'
          })
        }}
      />
    </ArticleShell>
  );
}
