import Link from 'next/link';
import { getPillar } from '@/lib/pillars';
import type { HolisticPillar } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

interface PillarBadgeProps {
  pillar: HolisticPillar;
  size?: 'sm' | 'md';
  className?: string;
  href?: string;
}

export function PillarBadge({ pillar, size = 'sm', className, href }: PillarBadgeProps) {
  const definition = getPillar(pillar);
  if (!definition) return null;
  const { icon: Icon, name, accentLight, accentDark } = definition;
  const classes = cn(
    'inline-flex items-center gap-1 rounded-full border border-transparent transition-colors',
    size === 'sm' ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs',
    accentLight,
    accentDark,
    href && 'hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-200',
    className
  );

  const content = (
    <>
      <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      <span className="font-medium tracking-tight">{name}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <span className={classes}>{content}</span>;
}
