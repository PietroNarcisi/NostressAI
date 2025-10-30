import Link from 'next/link';
import { HOLISTIC_PILLARS } from '@/lib/pillars';
import { cn } from '@/lib/utils/cn';

export function HolisticMap() {
  return (
    <section className="rounded-[28px] border border-neutral-100 bg-white/90 p-10 shadow-[0_45px_90px_-70px_rgba(39,58,54,0.45)] dark:border-neutral-800/60 dark:bg-neutral-900/60 md:p-14">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
        <div className="max-w-sm space-y-4">
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.35em] text-primary-500/80 dark:text-primary-300/80">
            Holistic Stress Lens
          </span>
          <h2 className="font-serif text-3xl font-semibold text-neutral-700 dark:text-neutral-50">
            Six pillars to calm the nervous system.
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            Stress is systemic. We work across nourishment, sleep, somatic resets, workflow hygiene, and the right mix of analog and AI tools.
            Start where you feel the most friction, then build outward.
          </p>
          <Link
            href="/approach"
            className="inline-flex items-center text-sm font-medium text-primary-600 transition hover:text-primary-500 dark:text-primary-200 dark:hover:text-primary-100"
          >
            Explore the holistic approach →
          </Link>
        </div>
        <div className="grid flex-1 gap-6 sm:grid-cols-2">
          {HOLISTIC_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className={cn(
                  'rounded-2xl border border-transparent p-6 transition hover:-translate-y-1 hover:shadow-[0_24px_45px_-32px_rgba(39,58,54,0.35)] dark:border-neutral-800/60',
                  pillar.accentLight,
                  pillar.accentDark
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-white/70 p-2 text-neutral-600 shadow-sm dark:bg-black/30">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-neutral-500/70 dark:text-neutral-200/70">{pillar.name}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm font-medium text-neutral-600 dark:text-neutral-200">{pillar.tagline}</p>
                <p className="mt-3 text-sm text-neutral-600/90 dark:text-neutral-200/80">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
