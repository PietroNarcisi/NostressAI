import type { HolisticPillar } from '@/lib/types';
import { Leaf, Moon, HeartPulse, Workflow, Bot, Palette } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface PillarDefinition {
  id: HolisticPillar;
  name: string;
  tagline: string;
  description: string;
  accentLight: string;
  accentDark: string;
  icon: LucideIcon;
}

export const HOLISTIC_PILLARS: PillarDefinition[] = [
  {
    id: 'nutrition',
    name: 'Nutrition & Energy',
    tagline: 'Fuel clarity through deliberate nourishment.',
    description:
      'Guides on stabilising blood sugar, micronutrient support, hydration, and caffeine management to keep cognitive load smooth throughout the day.',
    accentLight: 'bg-[#F0EFE8] text-[#6E705F]',
    accentDark: 'dark:bg-[#38372F] dark:text-[#D7D4C3]',
    icon: Leaf
  },
  {
    id: 'work',
    name: 'Work Systems',
    tagline: 'Design workflows that protect focus.',
    description:
      'Protocols for task batching, async rituals, and recovery cadences so the calendar and inbox stop hijacking your nervous system.',
    accentLight: 'bg-[#EAF1F1] text-[#4F7A75]',
    accentDark: 'dark:bg-[#2E3D3A] dark:text-[#A5C0BB]',
    icon: Workflow
  },
  {
    id: 'sleep',
    name: 'Sleep & Recovery',
    tagline: 'Anchor rest to stay antifragile.',
    description:
      'Evening wind-downs, light exposure, sleep debt tracking, and micro-recovery breaks tuned to calm the HPA axis and rebuild reserves.',
    accentLight: 'bg-[#EDEBFA] text-[#5C5A8E]',
    accentDark: 'dark:bg-[#312F49] dark:text-[#C8C5F1]',
    icon: Moon
  },
  {
    id: 'mind-body',
    name: 'Mind & Body',
    tagline: 'Somatic practices to metabolise stress.',
    description:
      'Breathing protocols, posture resets, mindful micro-pauses, and emotional granularity exercises to keep the body and mind aligned.',
    accentLight: 'bg-[#F3ECEF] text-[#84586B]',
    accentDark: 'dark:bg-[#3D2A32] dark:text-[#E3C4CF]',
    icon: HeartPulse
  },
  {
    id: 'ai-tools',
    name: 'AI Support',
    tagline: 'Let assistants carry the admin load.',
    description:
      'Prompt systems, review workflows, and governance principles so AI handles the repetitive tasks while you stay intentional.',
    accentLight: 'bg-[#E9EFF9] text-[#48648C]',
    accentDark: 'dark:bg-[#2B3547] dark:text-[#B7C6E6]',
    icon: Bot
  },
  {
    id: 'analog-tools',
    name: 'Analog Tools',
    tagline: 'Tactile aids to soothe and focus.',
    description:
      'Printable planners, mindful colouring, journaling scripts, and tactile routines that anchor you back into the physical world.',
    accentLight: 'bg-[#F6EFE9] text-[#8A6247]',
    accentDark: 'dark:bg-[#3B2B23] dark:text-[#E3C9B8]',
    icon: Palette
  }
];

export function getPillar(id: HolisticPillar): PillarDefinition | undefined {
  return HOLISTIC_PILLARS.find((pillar) => pillar.id === id);
}

export const PILLAR_IDS: HolisticPillar[] = HOLISTIC_PILLARS.map((pillar) => pillar.id);
