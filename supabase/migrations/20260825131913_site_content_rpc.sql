-- One round trip for the whole page.
--
-- Rendering / or /admin used to issue seven separate PostgREST requests
-- (site_texts, site_settings, home_facts, about_facts, about_stack, projects,
-- milestones). They ran in parallel, but each one still paid its own HTTP +
-- connection + auth + planning cost, and the page could not stream until the
-- slowest finished. This function returns the whole payload as a single jsonb
-- document in one statement instead.
--
-- security invoker (the default) keeps RLS in force exactly as before: the
-- function reads only tables whose select policy is public.

create or replace function public.get_site_content()
returns jsonb
language sql
stable
set search_path = public
as $$
  select jsonb_build_object(
    'site_texts', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'key', key, 'value_de', value_de, 'value_en', value_en
      ) order by key), '[]'::jsonb)
      from public.site_texts
    ),
    'site_settings', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'key', key, 'value', value
      ) order by key), '[]'::jsonb)
      from public.site_settings
    ),
    'home_facts', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', id, 'order', "order",
        'label_de', label_de, 'label_en', label_en,
        'value_de', value_de, 'value_en', value_en
      ) order by "order", id), '[]'::jsonb)
      from public.home_facts
    ),
    'about_facts', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', id, 'order', "order",
        'label_de', label_de, 'label_en', label_en,
        'value_de', value_de, 'value_en', value_en
      ) order by "order", id), '[]'::jsonb)
      from public.about_facts
    ),
    'about_stack', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', id, 'order', "order", 'name', name, 'icon', icon
      ) order by "order", id), '[]'::jsonb)
      from public.about_stack
    ),
    'projects', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', id, 'order', "order",
        'title_de', title_de, 'title_en', title_en,
        'blurb_de', blurb_de, 'blurb_en', blurb_en,
        'long1_de', long1_de, 'long1_en', long1_en,
        'long2_de', long2_de, 'long2_en', long2_en,
        'role_de', role_de, 'role_en', role_en,
        'year_de', year_de, 'year_en', year_en,
        'tech_tags', tech_tags, 'repo_url', repo_url,
        'screenshot_path', screenshot_path, 'screenshot_blur', screenshot_blur,
        'in_progress', in_progress
      ) order by "order", id), '[]'::jsonb)
      from public.projects
    ),
    'milestones', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', id, 'order', "order",
        'title_de', title_de, 'title_en', title_en,
        'note_de', note_de, 'note_en', note_en,
        'date_de', date_de, 'date_en', date_en,
        'done', done
      ) order by "order", id), '[]'::jsonb)
      from public.milestones
    )
  );
$$;

revoke all on function public.get_site_content() from public;
grant execute on function public.get_site_content() to anon, authenticated;
