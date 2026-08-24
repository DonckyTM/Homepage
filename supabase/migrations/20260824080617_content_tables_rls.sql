-- Content tables for site texts, about section, projects, milestones, and
-- contact form submissions, per the "Datenmodell" section of CLAUDE.md.
-- All content tables are public-read / admin-write via RLS; contact
-- submissions are locked down entirely and only reachable via the service
-- role key from a server-side endpoint (added in a later issue).

-- site_texts: hero, about paragraphs, section labels
create table if not exists public.site_texts (
  key text primary key,
  value_de text not null,
  value_en text not null
);

-- about_facts: role, company, year, location, focus
create table if not exists public.about_facts (
  id uuid primary key default gen_random_uuid(),
  label_de text not null,
  label_en text not null,
  value_de text not null,
  value_en text not null,
  "order" int not null default 0
);

-- about_stack: tech stack tags (e.g. C++, Python, SQL)
create table if not exists public.about_stack (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text,
  "order" int not null default 0
);

-- projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title_de text not null,
  title_en text not null,
  blurb_de text not null,
  blurb_en text not null,
  long1_de text not null,
  long1_en text not null,
  long2_de text not null,
  long2_en text not null,
  role_de text not null,
  role_en text not null,
  year_de text not null,
  year_en text not null,
  tech_tags text[] not null default '{}',
  repo_url text,
  screenshot_path text,
  in_progress boolean not null default false,
  "order" int not null default 0
);

-- milestones: build-log entries
create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  title_de text not null,
  title_en text not null,
  note_de text not null,
  note_en text not null,
  date_de text not null,
  date_en text not null,
  done boolean not null default false,
  "order" int not null default 0
);

-- contact_submissions: raw contact form data, no client access
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Row Level Security -------------------------------------------------------

alter table public.site_texts enable row level security;
alter table public.about_facts enable row level security;
alter table public.about_stack enable row level security;
alter table public.projects enable row level security;
alter table public.milestones enable row level security;
alter table public.contact_submissions enable row level security;

-- Content tables: public read, authenticated (admin) write.

create policy "site_texts_public_read" on public.site_texts
  for select
  to anon, authenticated
  using (true);

create policy "site_texts_admin_write" on public.site_texts
  for insert to authenticated
  with check (auth.role() = 'authenticated');

create policy "site_texts_admin_update" on public.site_texts
  for update to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "site_texts_admin_delete" on public.site_texts
  for delete to authenticated
  using (auth.role() = 'authenticated');

create policy "about_facts_public_read" on public.about_facts
  for select
  to anon, authenticated
  using (true);

create policy "about_facts_admin_write" on public.about_facts
  for insert to authenticated
  with check (auth.role() = 'authenticated');

create policy "about_facts_admin_update" on public.about_facts
  for update to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "about_facts_admin_delete" on public.about_facts
  for delete to authenticated
  using (auth.role() = 'authenticated');

create policy "about_stack_public_read" on public.about_stack
  for select
  to anon, authenticated
  using (true);

create policy "about_stack_admin_write" on public.about_stack
  for insert to authenticated
  with check (auth.role() = 'authenticated');

create policy "about_stack_admin_update" on public.about_stack
  for update to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "about_stack_admin_delete" on public.about_stack
  for delete to authenticated
  using (auth.role() = 'authenticated');

create policy "projects_public_read" on public.projects
  for select
  to anon, authenticated
  using (true);

create policy "projects_admin_write" on public.projects
  for insert to authenticated
  with check (auth.role() = 'authenticated');

create policy "projects_admin_update" on public.projects
  for update to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "projects_admin_delete" on public.projects
  for delete to authenticated
  using (auth.role() = 'authenticated');

create policy "milestones_public_read" on public.milestones
  for select
  to anon, authenticated
  using (true);

create policy "milestones_admin_write" on public.milestones
  for insert to authenticated
  with check (auth.role() = 'authenticated');

create policy "milestones_admin_update" on public.milestones
  for update to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "milestones_admin_delete" on public.milestones
  for delete to authenticated
  using (auth.role() = 'authenticated');

-- contact_submissions: intentionally no policies for anon/authenticated.
-- With RLS enabled and zero policies, all client access is denied; only the
-- service role key (which bypasses RLS) can read or write this table, from
-- a server-side endpoint added in a later issue.
