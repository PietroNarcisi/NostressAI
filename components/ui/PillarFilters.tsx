'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { HOLISTIC_PILLARS, PILLAR_IDS } from '@/lib/pillars';
import type { HolisticPillar } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

interface PillarFiltersProps {
  active?: HolisticPillar;
  className?: string;
  showAll?: boolean;
}

export function PillarFilters({ active, className, showAll = true }: PillarFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClick = (pillar?: HolisticPillar) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (!pillar) {
      params.delete('pillar');
    } else {
      params.set('pillar', pillar);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const groups = useMemo(() => HOLISTIC_PILLARS, []);

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {showAll && (
        <button
          type="button"
          onClick={() => handleClick(undefined)}
          className={cn(
            'rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-500 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800',
            !active && 'bg-neutral-900/5 text-neutral-700 dark:bg-neutral-100/10 dark:text-neutral-100'
          )}
        >
          All pillars
        </button>
      )}
      {groups.map((pillar) => (
        <button
          key={pillar.id}
          type="button"
          onClick={() => handleClick(pillar.id)}
          className={cn(
            'rounded-full border border-transparent px-3 py-1.5 text-xs font-medium transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-200',
            pillar.accentLight,
            pillar.accentDark,
            active === pillar.id ? 'ring-2 ring-primary-200/80 dark:ring-primary-700/50' : 'opacity-80'
          )}
        >
          {pillar.name}
        </button>
      ))}
    </div>
  );
}
