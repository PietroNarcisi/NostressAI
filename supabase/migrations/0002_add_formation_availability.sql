alter table public.formations
  add column if not exists availability text default 'available';
