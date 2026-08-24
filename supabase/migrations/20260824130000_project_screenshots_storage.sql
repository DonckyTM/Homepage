-- Storage bucket for project screenshots, per issue #8 ("Admin CRUD: Projects
-- + screenshot upload to Storage"). Public read so screenshots render on the
-- public site; writes require an authenticated (admin) session, same model
-- as the content tables' RLS.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-screenshots',
  'project-screenshots',
  true,
  5242880, -- 5MB, enforced again server-side before upload
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

-- storage.objects already has RLS enabled by Supabase; we don't own the
-- table so we can't (and don't need to) alter that setting ourselves.

create policy "project_screenshots_public_read" on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'project-screenshots');

create policy "project_screenshots_admin_write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'project-screenshots');

create policy "project_screenshots_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'project-screenshots')
  with check (bucket_id = 'project-screenshots');

create policy "project_screenshots_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'project-screenshots');
