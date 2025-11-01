import Link from 'next/link';
import { listFormations } from '@/lib/server/formations';
import { getAllPosts } from '@/lib/blog';
import { getAllResources } from '@/lib/resources';

export default async function AdminPage() {
  const [formations, posts, resources] = await Promise.all([
    listFormations(),
    getAllPosts(),
    getAllResources()
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Dashboard</h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Quick snapshot of the content currently published on NoStress AI.
        </p>
      </div>
      <section className="grid gap-4 sm:grid-cols-3">
        {[{
          label: 'Articles',
          count: posts.length,
          href: '/blog'
        }, {
          label: 'Formations',
          count: formations.length,
          href: '/courses'
        }, {
          label: 'Resources',
          count: resources.length,
          href: '/resources'
        }].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 py-5 shadow-sm transition hover:border-primary-200 dark:hover:border-primary-600"
          >
            <p className="text-xs uppercase tracking-wide text-neutral-400 dark:text-neutral-500">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold text-primary-600 dark:text-primary-400">{item.count}</p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">View on site →</p>
          </Link>
        ))}
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Next steps</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-300">
          <li>Use Supabase Dashboard to create or edit content entries.</li>
          <li>Promote new formations by updating their status to <code>available</code>.</li>
          <li>Keep pillar assignments up to date so filters remain helpful.</li>
        </ul>
      </section>
    </div>
  );
}
