-- home_facts: the three fact cards shown on the Home tab (role, based in,
-- focus). Previously hardcoded in lib/data/aboutFacts.ts; split out from
-- about_facts because it's a distinct (shorter) list with its own order.

create table if not exists public.home_facts (
  id uuid primary key default gen_random_uuid(),
  label_de text not null,
  label_en text not null,
  value_de text not null,
  value_en text not null,
  "order" int not null default 0
);

alter table public.home_facts enable row level security;

create policy "home_facts_public_read" on public.home_facts
  for select
  to anon, authenticated
  using (true);

create policy "home_facts_admin_write" on public.home_facts
  for insert to authenticated
  with check (auth.role() = 'authenticated');

create policy "home_facts_admin_update" on public.home_facts
  for update to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "home_facts_admin_delete" on public.home_facts
  for delete to authenticated
  using (auth.role() = 'authenticated');

insert into public.home_facts (label_de, label_en, value_de, value_en, "order") values
  ('Rolle', 'Role', 'SWE-Azubi', 'SWE Apprentice', 1),
  ('Standort', 'Based in', 'Frankfurt a. M.', 'Frankfurt a. M.', 2),
  ('Schwerpunkt', 'Focus', 'Backend · C++', 'Backend · C++', 3);
