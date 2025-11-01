-- Enable UUID generation helpers
create extension if not exists "pgcrypto";

-- Enums
create type publication_status as enum ('draft', 'published', 'archived');
create type resource_kind as enum ('tip', 'study', 'tool');
create type user_role as enum ('viewer', 'editor', 'admin');

-- Pillars catalogue
create table if not exists public.pillars (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Articles
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  category text,
  body_mdx text not null,
  tags text[] not null default '{}',
  hero_image text,
  interactive_slug text,
  status publication_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.article_pillars (
  article_id uuid not null references public.articles(id) on delete cascade,
  pillar_id uuid not null references public.pillars(id) on delete cascade,
  primary key (article_id, pillar_id)
);

-- Formations / Courses
create table if not exists public.formations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  summary text,
  description_mdx text not null,
  price numeric(10,2),
  duration text,
  level text,
  modules jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  status publication_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.formation_pillars (
  formation_id uuid not null references public.formations(id) on delete cascade,
  pillar_id uuid not null references public.pillars(id) on delete cascade,
  primary key (formation_id, pillar_id)
);

-- Resources (tips, studies, tools…)
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  type resource_kind not null,
  title text not null,
  excerpt text,
  body_mdx text not null,
  tags text[] not null default '{}',
  status publication_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resource_pillars (
  resource_id uuid not null references public.resources(id) on delete cascade,
  pillar_id uuid not null references public.pillars(id) on delete cascade,
  primary key (resource_id, pillar_id)
);

-- Videos (optional curated embeds)
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  platform text,
  url text not null,
  summary text,
  tags text[] not null default '{}',
  status publication_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.video_pillars (
  video_id uuid not null references public.videos(id) on delete cascade,
  pillar_id uuid not null references public.pillars(id) on delete cascade,
  primary key (video_id, pillar_id)
);

-- Profiles for authenticated users
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role user_role not null default 'viewer',
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

---------------------------------------
-- Row Level Security & policies
---------------------------------------

alter table public.articles enable row level security;
alter table public.article_pillars enable row level security;
alter table public.formations enable row level security;
alter table public.formation_pillars enable row level security;
alter table public.resources enable row level security;
alter table public.resource_pillars enable row level security;
alter table public.videos enable row level security;
alter table public.video_pillars enable row level security;
alter table public.pillars enable row level security;
alter table public.profiles enable row level security;

-- Allow public read access to published content
create policy "Public read published articles" on public.articles
  for select
  using (status = 'published');

create policy "Public read article pillars" on public.article_pillars
  for select using (
    exists (
      select 1 from public.articles a
      where a.id = article_id and a.status = 'published'
    )
  );

create policy "Public read published formations" on public.formations
  for select
  using (status = 'published');

create policy "Public read formation pillars" on public.formation_pillars
  for select using (
    exists (
      select 1 from public.formations f
      where f.id = formation_id and f.status = 'published'
    )
  );

create policy "Public read published resources" on public.resources
  for select
  using (status = 'published');

create policy "Public read resource pillars" on public.resource_pillars
  for select using (
    exists (
      select 1 from public.resources r
      where r.id = resource_id and r.status = 'published'
    )
  );

create policy "Public read published videos" on public.videos
  for select
  using (status = 'published');

create policy "Public read video pillars" on public.video_pillars
  for select using (
    exists (
      select 1 from public.videos v
      where v.id = video_id and v.status = 'published'
    )
  );

create policy "Public read pillars" on public.pillars
  for select using (true);

-- Profiles: users can read their own profile; service role can manage others
create policy "Users read own profile" on public.profiles
  for select using (auth.uid() = user_id);

create policy "Users update own profile" on public.profiles
  for update using (auth.uid() = user_id);
