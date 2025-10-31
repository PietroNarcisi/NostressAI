import { getAllResources } from '@/lib/resources';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const dynamic = 'force-static';

export default function RessourcesPage() {
  const items = getAllResources();
  const tips = items.filter((i) => i.type === 'tip');
  const studies = items.filter((i) => i.type === 'study');
  return (
    <div className="space-y-16">
      <SectionHeading title="Ressources" eyebrow="Pratique & Études" />
      <section>
        <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase text-primary-600 dark:text-primary-400">Conseils pratiques</h3>
        {tips.length === 0 && <p className="text-sm text-neutral-500">Bientôt.</p>}
        <ul className="space-y-4">
          {tips.map((t) => (
            <li key={t.slug} className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <h4 className="font-medium mb-1">{t.title}</h4>
              {t.excerpt && <p className="text-xs text-neutral-600 dark:text-neutral-400">{t.excerpt}</p>}
              <p className="mt-2 text-[10px] uppercase tracking-wide text-neutral-500">{t.tags.join(' · ')}</p>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase text-primary-600 dark:text-primary-400">Études & Synthèses</h3>
        {studies.length === 0 && <p className="text-sm text-neutral-500">Bientôt.</p>}
        <ul className="space-y-4">
          {studies.map((s) => (
            <li key={s.slug} className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <h4 className="font-medium mb-1">{s.title}</h4>
              {s.excerpt && <p className="text-xs text-neutral-600 dark:text-neutral-400">{s.excerpt}</p>}
              <p className="mt-2 text-[10px] uppercase tracking-wide text-neutral-500">{s.tags.join(' · ')}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
