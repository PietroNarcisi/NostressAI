import { Formation } from '@/lib/types';

export const formations: Formation[] = [
  {
    slug: 'starter-ia-serenite-familiale',
    title: 'Starter: AI & Family Calm',
    short: 'Understand, filter and use AI at home without adding stress.',
    status: 'soon',
    level: 'intro',
    pillars: ['nutrition', 'mind-body', 'ai-tools'],
    outline: [
      'Map cognitive frictions and trigger points',
      'Identify tasks that can be safely externalized',
      'Design guardrail protocols with the family',
      'Set up a lightweight follow-up system'
    ]
  },
  {
    slug: 'routine-anti-surcharge-4-semaines',
    title: 'Anti-Overload Routine (4 weeks)',
    short: 'Build a lean system to reduce mental load and emotional spillover.',
    status: 'prelaunch',
    level: 'intermediate',
    pillars: ['work', 'sleep', 'ai-tools'],
    outline: [
      'Week 1 – Audit & attention hygiene',
      'Week 2 – Contextual automations',
      'Week 3 – “Just enough” AI routines',
      'Week 4 – Consolidation & metrics'
    ]
  },
  {
    slug: 'atelier-focus-attention',
    title: 'Focus & Attention Workshop',
    short: 'Reduce fragmentation and rebuild clarity with practical drills.',
    status: 'available',
    level: 'intermediate',
    pillars: ['mind-body', 'sleep', 'analog-tools'],
    outline: [
      'Mechanics of attention drift',
      'Anti-doomscrolling scripts and guardrails',
      'Structuring deep-work blocks',
      'Recovery and reset protocols'
    ]
  }
];

export function getFormation(slug: string) {
  return formations.find((f) => f.slug === slug);
}
