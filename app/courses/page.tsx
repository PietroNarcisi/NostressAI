import Link from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { listFormations } from '@/lib/server/formations';
import type { FormationStatus } from '@/lib/types';

const statusLabel: Record<FormationStatus, string> = {
  soon: 'Soon',
  prelaunch: 'Prelaunch',
  available: 'Available'
};

export default async function CoursesIndex() {
  const formations = await listFormations();
  return (
    <div>
      <SectionHeading title="Courses" eyebrow="Programs" />
      <div className="grid gap-6 sm:grid-cols-2">
        {formations.map((f) => (
          <Link key={f.slug} href={`/courses/${f.slug}`}>
            <Card
              title={f.title}
              description={f.short}
              pillars={f.pillars}
              footer={
                <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                  <span className="text-[11px] uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                    {statusLabel[f.status]}
                  </span>
                  <span>{f.outline?.length ?? 0} modules</span>
                </div>
              }
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
