-- Editable brand icon + name in the header (admin-only). The name is a
-- localized site_texts entry like other copy; the logo is a singleton
-- setting (not localized, not a list) so it gets its own small key/value
-- table rather than abusing site_texts' de/en columns for a storage path.

create table if not exists public.site_settings (
  key text primary key,
  value text
);

alter table public.site_settings enable row level security;

create policy "site_settings_public_read" on public.site_settings
  for select
  to anon, authenticated
  using (true);

create policy "site_settings_admin_write" on public.site_settings
  for insert to authenticated
  with check (auth.role() = 'authenticated');

create policy "site_settings_admin_update" on public.site_settings
  for update to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "site_settings_admin_delete" on public.site_settings
  for delete to authenticated
  using (auth.role() = 'authenticated');

insert into public.site_settings (key, value) values
  ('brand_logo_path', null)
on conflict (key) do nothing;

insert into public.site_texts (key, value_en, value_de) values
  ('brandName', 'Florian Dehm', 'Florian Dehm')
on conflict (key) do nothing;

-- Storage bucket for the header logo, same public-read/admin-write model as
-- project screenshots.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'brand-assets',
  'brand-assets',
  true,
  2097152, -- 2MB, enforced again server-side before upload
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

create policy "brand_assets_public_read" on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'brand-assets');

create policy "brand_assets_admin_write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'brand-assets');

create policy "brand_assets_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'brand-assets')
  with check (bucket_id = 'brand-assets');

create policy "brand_assets_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'brand-assets');
