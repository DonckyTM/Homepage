-- The "Currently building this site" pill on Home was removed from the UI;
-- drop the now-unreachable site_texts row instead of leaving dead content
-- with no admin control pointing at it.
delete from public.site_texts where key = 'statusPill';
