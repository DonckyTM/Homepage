-- Seed data migrated from lib/data/*.ts (see CLAUDE.md Datenmodell).
-- Straight copy of existing DE/EN copy -- do not paraphrase.

insert into public.site_texts (key, value_en, value_de) values
  ('statusPill', 'Currently building this site', 'Baue gerade diese Seite'),
  ('heroTitle', 'Backend apprentice, C++ curious.', 'Backend-Azubi, neugierig auf C++.'),
  ('heroBody', 'I''m Florian — a third-year software engineering apprentice at Deutsche Börse in Frankfurt. I spend most of my time on backend systems and C++, and this page is where I''ll keep track of what I build along the way.', 'Ich bin Florian — Fachinformatiker-Azubi im dritten Lehrjahr bei der Deutschen Börse in Frankfurt. Den Großteil meiner Zeit verbringe ich mit Backend-Systemen und C++, und hier halte ich fest, was dabei entsteht.'),
  ('ctaMail', 'Say hello', 'Schreib mir'),
  ('nowLabel', 'Right now', 'Gerade jetzt'),
  ('nowTitle', 'Building my first project — this homepage', 'Mein erstes Projekt — diese Homepage'),
  ('nowBody', 'My first real web project, written from scratch. Follow the build log to see where it stands.', 'Mein erstes richtiges Webprojekt, von Grund auf gebaut. Im Build-Log siehst du, wo es steht.'),
  ('nowCta', 'See the build log', 'Zum Build-Log'),
  ('aboutTitle', 'About me', 'Über mich'),
  ('aboutP1', 'I''m Florian Dehm, a software engineering apprentice in my third year at Deutsche Börse, based in Frankfurt am Main.', 'Ich bin Florian Dehm, Softwareentwickler-Azubi im dritten Lehrjahr bei der Deutschen Börse, wohnhaft in Frankfurt am Main.'),
  ('aboutP2', 'Most of my day is backend work — the parts of a system nobody sees but everything depends on. C++ is what I keep coming back to: it''s unforgiving, and that''s exactly why I like it.', 'Der größte Teil meines Tages ist Backend-Arbeit — die Teile eines Systems, die niemand sieht und von denen alles abhängt. C++ ist das, wozu ich immer zurückkomme: es verzeiht nichts, und genau deshalb mag ich es.'),
  ('aboutP3', 'This site is my first project outside of work. It''s small on purpose. I''d rather finish something honest than start something ambitious and drop it.', 'Diese Seite ist mein erstes Projekt außerhalb der Arbeit. Bewusst klein gehalten. Lieber etwas Ehrliches fertigstellen als etwas Großes anfangen und liegen lassen.'),
  ('stackLabel', 'Working with', 'Arbeite mit'),
  ('projectsTitle', 'Projects', 'Projekte'),
  ('projectsIntro', 'One at a time, finished before the next. Here''s what exists so far.', 'Eins nach dem anderen, fertig bevor das nächste beginnt. Das hier gibt es bisher.'),
  ('cardCta', 'Details', 'Details'),
  ('inProgress', 'In progress', 'In Arbeit'),
  ('emptyTitle', 'Nothing else here yet', 'Sonst noch nichts'),
  ('emptyBody', 'The second project starts once the first one is genuinely done. Check back.', 'Das zweite Projekt startet, wenn das erste wirklich fertig ist. Schau später nochmal vorbei.'),
  ('modalRepo', 'View on GitHub', 'Auf GitHub ansehen'),
  ('modalClose', 'Close', 'Schließen'),
  ('modalRoleLabel', 'Role', 'Rolle'),
  ('modalYearLabel', 'Status', 'Status'),
  ('modalTechLabel', 'Built with', 'Gebaut mit'),
  ('currentTitle', 'Current project', 'Aktuelles Projekt'),
  ('updated', 'Updated Aug 2026', 'Stand Aug. 2026'),
  ('currentIntro', 'This homepage. Here''s an honest checklist of what''s done and what''s still open.', 'Diese Homepage. Hier eine ehrliche Checkliste: was steht und was noch offen ist.'),
  ('progressLabel', 'Progress', 'Fortschritt'),
  ('learningLabel', 'What I''m learning from it', 'Was ich dabei lerne'),
  ('learningBody', 'Layout is harder than logic. Getting spacing, type and contrast to feel calm took longer than any of the code — and I''d rather sit with that than hide it behind a template.', 'Layout ist schwerer als Logik. Abstände, Typo und Kontrast ruhig wirken zu lassen hat länger gedauert als der ganze Code — und das gebe ich lieber zu, als es hinter einem Template zu verstecken.'),
  ('tab_home', 'Home', 'Start'),
  ('tab_about', 'About', 'Über mich'),
  ('tab_projects', 'Projects', 'Projekte'),
  ('tab_current', 'Current', 'Aktuell')
on conflict (key) do update set value_en = excluded.value_en, value_de = excluded.value_de;

insert into public.about_facts (label_en, label_de, value_en, value_de, "order") values
  ('Role', 'Rolle', 'Software Engineer (Apprentice)', 'Softwareentwickler (Azubi)', 1),
  ('Company', 'Unternehmen', 'Deutsche Börse', 'Deutsche Börse', 2),
  ('Year', 'Lehrjahr', '3rd of apprenticeship', '3. Lehrjahr', 3),
  ('Based in', 'Standort', 'Frankfurt am Main, DE', 'Frankfurt am Main, DE', 4),
  ('Focus', 'Schwerpunkt', 'Backend · C++', 'Backend · C++', 5);

insert into public.about_stack (name, icon, "order") values
  ('C++', NULL, 1),
  ('Python', NULL, 2),
  ('SQL', NULL, 3),
  ('Git', NULL, 4),
  ('Linux', NULL, 5),
  ('HTML/CSS', NULL, 6),
  ('JavaScript', NULL, 7);

insert into public.projects (title_en, title_de, blurb_en, blurb_de, long1_en, long1_de, long2_en, long2_de, role_en, role_de, year_en, year_de, tech_tags, repo_url, screenshot_path, in_progress, "order") values
  ('Personal homepage', 'Persönliche Homepage', 'This site — my first project. Tabs, dark mode, two languages, and a build log I actually keep updated.', 'Diese Seite — mein erstes Projekt. Tabs, Dark Mode, zwei Sprachen und ein Build-Log, das ich wirklich pflege.', 'My first project outside of work: a small personal site built from scratch, no framework and no template. It has four tabs, a light and dark theme with a full token set, German and English throughout, and a build log I keep honest — including the parts that aren''t done.', 'Mein erstes Projekt außerhalb der Arbeit: eine kleine persönliche Seite, von Grund auf gebaut — ohne Framework, ohne Template. Vier Tabs, helles und dunkles Theme mit vollständigen Tokens, durchgehend Deutsch und Englisch, und ein Build-Log, das ehrlich bleibt — inklusive der Punkte, die noch offen sind.', 'The interesting part wasn''t the code. Getting spacing, type and contrast to feel calm took far longer than the logic did, and that''s the part I''d do differently next time: design first, then build.', 'Das Spannende war nicht der Code. Abstände, Typo und Kontrast ruhig wirken zu lassen hat deutlich länger gedauert als die Logik — und genau das würde ich beim nächsten Mal anders machen: erst gestalten, dann bauen.', 'Everything — design and code', 'Alles — Design und Code', '2026 · in progress', '2026 · in Arbeit', ARRAY['HTML','CSS','JavaScript']::text[], 'https://github.com/DonckyTM', NULL, true, 1);

insert into public.milestones (title_en, title_de, note_en, note_de, date_en, date_de, done, "order") values
  ('Decide what the site should be', 'Festlegen, was die Seite sein soll', 'Four tabs, no blog, no clutter.', 'Vier Tabs, kein Blog, kein Ballast.', 'Jul 2026', 'Jul. 2026', true, 1),
  ('Structure and navigation', 'Struktur und Navigation', 'Home, About, Projects, Current — one tab bar, no nesting.', 'Home, Über mich, Projekte, Aktuell — eine Tab-Leiste, keine Verschachtelung.', 'Jul 2026', 'Jul. 2026', true, 2),
  ('Visual language', 'Visuelle Sprache', 'Type scale, neutral palette, one accent.', 'Typo-Skala, neutrale Palette, ein Akzent.', 'Aug 2026', 'Aug. 2026', true, 3),
  ('Dark mode', 'Dark Mode', 'Full token set for both themes.', 'Vollständige Tokens für beide Themes.', 'Aug 2026', 'Aug. 2026', true, 4),
  ('German + English', 'Deutsch + Englisch', 'Every string translated, toggle in the header.', 'Jeder Text übersetzt, Umschalter im Header.', 'Aug 2026', 'Aug. 2026', true, 5),
  ('Real project entries', 'Echte Projekteinträge', 'Waiting on the first finished project.', 'Wartet auf das erste fertige Projekt.', 'open', 'offen', false, 6),
  ('Put it online', 'Online stellen', 'Own domain, deploy pipeline.', 'Eigene Domain, Deploy-Pipeline.', 'open', 'offen', false, 7);

