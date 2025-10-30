import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { HOLISTIC_PILLARS } from '@/lib/pillars';
import { cn } from '@/lib/utils/cn';

export const metadata: Metadata = {
  title: 'Our Approach',
  description:
    'NoStress AI treats stress as a systemic signal. Explore the six pillars—nutrition, work systems, sleep, mind & body, AI support, analog tools.'
};

export default function ApproachPage() {
  return (
    <div className="space-y-16">
      <section className="rounded-[32px] border border-neutral-100 bg-white/90 p-10 shadow-[0_45px_90px_-70px_rgba(39,58,54,0.45)] dark:border-neutral-800/60 dark:bg-neutral-900/70 md:p-16">
        <div className="max-w-3xl space-y-5">
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.35em] text-primary-500/80 dark:text-primary-300/80">
            Why holistic?
          </span>
          <h1 className="font-serif text-4xl font-semibold text-neutral-700 dark:text-neutral-50">Stress is systemic—so is our method.</h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            Acute stress is a signal that nutrition, sleep, workflows, somatic recovery, or tool stacks are out of alignment. We map your landscape,
            shore up the easiest wins first, and build a living system that keeps your nervous system informed—not overwhelmed.
          </p>
          <p className="text-neutral-600 dark:text-neutral-300">
            Below are the six pillars we iterate with. You don’t need to overhaul everything at once—start with the area creating the loudest friction
            and we’ll cross-pollinate improvements across the others.
          </p>
        </div>
      </section>

      <SectionHeading title="The Six Pillars" eyebrow="Holistic Stress Map" />
      <div className="grid gap-6 md:grid-cols-2">
        {HOLISTIC_PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <article
              key={pillar.id}
              className={cn(
                'rounded-2xl border border-transparent p-6 transition hover:-translate-y-1 hover:shadow-[0_24px_45px_-32px_rgba(39,58,54,0.35)]',
                pillar.accentLight,
                pillar.accentDark
              )}
            >
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-white/70 p-2 text-neutral-600 shadow-sm dark:bg-black/30">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="font-serif text-xl font-semibold">{pillar.name}</h2>
              </div>
              <p className="mt-3 text-sm font-medium text-neutral-600/90 dark:text-neutral-200/90">{pillar.tagline}</p>
              <p className="mt-3 text-sm text-neutral-600/90 dark:text-neutral-200/80">{pillar.description}</p>
            </article>
          );
        })}
      </div>

      <SectionHeading title="Where to begin" eyebrow="Pick your next step" />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-neutral-100 bg-white/90 p-6 dark:border-neutral-800/70 dark:bg-neutral-900/60">
          <h3 className="font-serif text-lg font-semibold text-neutral-700 dark:text-neutral-50">Quick self-scan</h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            Notice where stress shows up first: digestion, sleep, schedule chaos, physical tension? Start with that pillar and stabilise a single habit.
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-100 bg-white/90 p-6 dark:border-neutral-800/70 dark:bg-neutral-900/60">
          <h3 className="font-serif text-lg font-semibold text-neutral-700 dark:text-neutral-50">Pair pillars</h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            Improvements stick when anchors reinforce each other—link sleep cues with analog tools, or nutrition shifts with workday rituals.
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-100 bg-white/90 p-6 dark:border-neutral-800/70 dark:bg-neutral-900/60">
          <h3 className="font-serif text-lg font-semibold text-neutral-700 dark:text-neutral-50">Prefer guided support?</h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            Our courses blend bite-sized theory with templates and tools across the relevant pillars.
          </p>
          <Link href="/courses" className="mt-3 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-200">
            Browse courses →
          </Link>
        </div>
      </div>
    </div>
  );
}
