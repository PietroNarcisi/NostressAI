import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PillarBadge } from '@/components/ui/PillarBadge';
import { listFormations, getFormationBySlug } from '@/lib/server/formations';

export async function generateStaticParams() {
  const formations = await listFormations();
  return formations.map((formation) => ({ slug: formation.slug }));
}

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const formation = await getFormationBySlug(params.slug);
  if (!formation) return notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/courses" className="text-xs text-primary-600 hover:underline">← Back to courses</Link>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{formation.title}</h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-300 max-w-2xl">{formation.short}</p>
        {formation.pillars && (
          <div className="mt-4 flex flex-wrap gap-2">
            {formation.pillars.map((pillar) => (
              <PillarBadge key={pillar} pillar={pillar} />
            ))}
          </div>
        )}
      </div>
      <section>
        <h2 className="text-lg font-semibold mb-4">Outline</h2>
        <ol className="list-decimal ml-5 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
          {formation.outline?.map((module) => (
            <li key={module}>{module}</li>
          ))}
        </ol>
      </section>
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 bg-neutral-50 dark:bg-neutral-900">
        <h3 className="font-medium mb-2">Interested?</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Leave your email to be notified when registration opens.</p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md">
          <input type="email" placeholder="Your email" className="flex-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2 text-sm" />
          <Button type="button">Keep me posted</Button>
        </form>
      </div>
    </div>
  );
}
