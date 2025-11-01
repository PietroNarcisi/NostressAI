-- Reset profile policies to guarantee OAuth sign-ins succeed under RLS
drop policy if exists "Users insert own profile" on public.profiles;
drop policy if exists "Users read own profile" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;

create policy "Users insert own profile" on public.profiles
  for insert
  with check (auth.uid() = user_id);

create policy "Users read own profile" on public.profiles
  for select
  using (auth.uid() = user_id);

create policy "Users update own profile" on public.profiles
  for update
  using (auth.uid() = user_id);
