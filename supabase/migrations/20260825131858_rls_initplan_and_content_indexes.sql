-- Query optimization pass.
--
-- 1) RLS: every admin policy called auth.role() unwrapped, so Postgres
--    re-evaluated it once per row instead of once per statement
--    (Supabase performance lint 0003_auth_rls_initplan). Wrapping the call in
--    a scalar subquery turns it into an InitPlan that runs a single time.
-- 2) contact_submissions is the one table that grows unbounded, and the admin
--    inbox reads it newest-first. The content tables stay in the tens of rows,
--    so they are left to seq scan — an index there would only add write cost.
-- 3) projects.screenshot_blur: tiny base64 LQIP rendered inline while the real
--    screenshot loads (see lib/images.ts).

-- 1) RLS admin policies -----------------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'site_texts', 'site_settings', 'home_facts', 'about_facts',
    'about_stack', 'projects', 'milestones'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', t || '_admin_write', t);
    execute format('drop policy if exists %I on public.%I', t || '_admin_update', t);
    execute format('drop policy if exists %I on public.%I', t || '_admin_delete', t);

    execute format(
      'create policy %I on public.%I for insert to authenticated
         with check ((select auth.role()) = ''authenticated'')',
      t || '_admin_write', t
    );
    execute format(
      'create policy %I on public.%I for update to authenticated
         using ((select auth.role()) = ''authenticated'')
         with check ((select auth.role()) = ''authenticated'')',
      t || '_admin_update', t
    );
    execute format(
      'create policy %I on public.%I for delete to authenticated
         using ((select auth.role()) = ''authenticated'')',
      t || '_admin_delete', t
    );
  end loop;
end
$$;

-- 2) Contact inbox index ----------------------------------------------------

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

-- 3) Blur placeholder column ------------------------------------------------

alter table public.projects add column if not exists screenshot_blur text;
