-- Security hardening: replace "any authenticated user is an admin" with a real
-- allow-list, and add the shared rate-limit store.
--
-- The previous policies were all shaped `to authenticated ... using (auth.role()
-- = 'authenticated')`, which is a tautology: the policy is already scoped to the
-- authenticated role, so the check added nothing. Combined with public signup
-- being enabled on the project, that meant any stranger who registered an
-- account could rewrite or delete every content row and every storage object.

-- Admin allow-list ---------------------------------------------------------

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- No policies on purpose: with RLS on and zero policies, anon/authenticated are
-- denied entirely and only the service role can read or change the list.
alter table public.admins enable row level security;

-- security definer so a non-admin can evaluate the check against a table they
-- cannot read; the pinned search_path is what makes that safe.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- Supabase grants EXECUTE on new public-schema functions to anon/authenticated
-- by default, so an explicit revoke per role is required -- `from public` alone
-- does not remove those grants.
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated, service_role;

-- Seed by email rather than a hardcoded UUID so this migration stays portable.
insert into public.admins (user_id)
select id from auth.users where email = 'florian@dehm-online.de'
on conflict (user_id) do nothing;

-- Content tables: public read stays, writes become admin-only ---------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'site_texts', 'home_facts', 'about_facts', 'about_stack',
    'projects', 'milestones', 'site_settings'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', t || '_admin_write', t);
    execute format('drop policy if exists %I on public.%I', t || '_admin_update', t);
    execute format('drop policy if exists %I on public.%I', t || '_admin_delete', t);

    execute format(
      'create policy %I on public.%I for insert to authenticated with check (public.is_admin())',
      t || '_admin_write', t);
    execute format(
      'create policy %I on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())',
      t || '_admin_update', t);
    execute format(
      'create policy %I on public.%I for delete to authenticated using (public.is_admin())',
      t || '_admin_delete', t);
  end loop;
end
$$;

-- The *_public_read policies are deliberately left untouched: the site has to
-- stay readable by anonymous visitors. contact_submissions keeps its deny-all
-- posture (RLS on, zero policies) -- only the service role reaches it.

-- Storage buckets: same change ---------------------------------------------

do $$
declare
  b text;
  prefix text;
begin
  foreach b in array array['project-screenshots', 'brand-assets']
  loop
    prefix := replace(b, '-', '_');

    execute format('drop policy if exists %I on storage.objects', prefix || '_admin_write');
    execute format('drop policy if exists %I on storage.objects', prefix || '_admin_update');
    execute format('drop policy if exists %I on storage.objects', prefix || '_admin_delete');

    execute format(
      'create policy %I on storage.objects for insert to authenticated with check (bucket_id = %L and public.is_admin())',
      prefix || '_admin_write', b);
    execute format(
      'create policy %I on storage.objects for update to authenticated using (bucket_id = %L and public.is_admin()) with check (bucket_id = %L and public.is_admin())',
      prefix || '_admin_update', b, b);
    execute format(
      'create policy %I on storage.objects for delete to authenticated using (bucket_id = %L and public.is_admin())',
      prefix || '_admin_delete', b);
  end loop;
end
$$;

-- repo_url scheme allow-list -----------------------------------------------

-- Last line of defence for the stored-XSS sink in components/ProjectModal.tsx:
-- the column is rendered into an <a href>, where a javascript: value would
-- execute. Also enforced on write (app/admin/actions.ts) and on render.
alter table public.projects
  drop constraint if exists projects_repo_url_scheme;

alter table public.projects
  add constraint projects_repo_url_scheme
  check (repo_url is null or repo_url ~ '^https?://[^[:space:]]+$');

-- Shared rate-limit store --------------------------------------------------

-- The previous limiter was an in-memory Map, so on Vercel each lambda kept its
-- own counters: the effective limit was 5 x instance-count and reset on every
-- cold start. This table is shared across instances and survives deploys.
create table if not exists public.rate_limits (
  key text not null,
  bucket text not null,
  window_start timestamptz not null default now(),
  hits int not null default 1,
  primary key (key, bucket)
);

-- No policies: service-role only, same posture as contact_submissions.
alter table public.rate_limits enable row level security;

-- Returns true when the caller is over the limit. The upsert is atomic, so
-- concurrent lambdas cannot race past the cap.
create or replace function public.consume_rate_limit(
  p_key text,
  p_bucket text,
  p_max int,
  p_window_seconds int
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_hits int;
begin
  insert into public.rate_limits as rl (key, bucket, window_start, hits)
  values (p_key, p_bucket, now(), 1)
  on conflict (key, bucket) do update
    set hits = case
          when rl.window_start < now() - make_interval(secs => p_window_seconds) then 1
          else rl.hits + 1
        end,
        window_start = case
          when rl.window_start < now() - make_interval(secs => p_window_seconds) then now()
          else rl.window_start
        end
  returning rl.hits into v_hits;

  -- Opportunistic cleanup so the table cannot grow without bound.
  if random() < 0.01 then
    delete from public.rate_limits where window_start < now() - interval '1 day';
  end if;

  return v_hits > p_max;
end;
$$;

-- Server-side callers only. Left reachable by anon, this RPC would let anyone
-- burn another visitor's contact quota or lock the owner out of /admin/login by
-- exhausting the admin_login bucket for their email.
revoke execute on function public.consume_rate_limit(text, text, int, int)
  from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, text, int, int) to service_role;
