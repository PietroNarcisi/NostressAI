export type HolisticPillar =
  | 'nutrition'
  | 'work'
  | 'sleep'
  | 'mind-body'
  | 'ai-tools'
  | 'analog-tools';

export interface BlogMeta {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  pillars?: HolisticPillar[];
}

export type ResourceType = 'tip' | 'study';

export interface ResourceMeta {
  slug: string;
  title: string;
  type: ResourceType;
  tags: string[];
  date: string;
  excerpt?: string;
  pillars?: HolisticPillar[];
}

export type FormationStatus = 'soon' | 'prelaunch' | 'available';
export type FormationLevel = 'intro' | 'intermediate' | 'advanced';

export interface Formation {
  slug: string;
  title: string;
  short: string;
  status: FormationStatus;
  level?: FormationLevel;
  outline?: string[];
  pillars?: HolisticPillar[];
}
