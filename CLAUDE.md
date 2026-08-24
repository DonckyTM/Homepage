# Florian Dehm — Personal Homepage

## Projektüberblick

Persönliche Portfolio-/Homepage von Florian Dehm, Softwareentwickler-Azubi (3. Lehrjahr) bei der
Deutschen Börse in Frankfurt am Main, Schwerpunkt Backend & C++.

Die Seite hat vier Tabs: **Home, About, Projects, Current** (Build-Log). Sie ist durchgehend
zweisprachig (DE/EN) und unterstützt Light/Dark Mode.

**Zielzustand:** Eine vollwertige Next.js-App mit Supabase als Datenbank-Backend und einer per
Supabase Auth geschützten Admin-Oberfläche, über die Florian **alle** Inhalte selbst pflegen kann —
Texte, Bilder, Icons, About-Tags/Stack, Timeline und Build-Log-Meilensteine — ohne Code anzufassen.

Die Admin-Oberfläche ist dabei bewusst **kein separates Dashboard** mit Formularen und Listen,
sondern die Live-Seite selbst im Bearbeitungsmodus: unter `/admin` wird exakt dieselbe Komponente
gerendert wie auf `/`, nur mit kleinen Stift-Icons neben jedem editierbaren Inhalt. Ein Klick öffnet
ein Inline-Popover direkt an der Textstelle (DE/EN-Felder, Speichern/Abbrechen) — kein Wechsel auf
eine andere Seite, keine Tabellen-Ansicht. Details siehe „Admin-Panel — Anforderungen" unten.

## Aktueller Stand

- **Supabase-Projekt:** angelegt und produktiv (Region `eu-west-2`). Schema und RLS-Policies liegen
  als Migrationen in `supabase/migrations/`, Erstbefüllung in `supabase/seed.sql`.
- **Öffentliche Seite:** `/` liest alle Inhalte live aus Supabase (`lib/data/*.ts`) — kein
  hartcodiertes Copy mehr außer den vier Tab-IDs selbst (`lib/data/tabs.ts`).
- **Admin-Auth:** `/admin` und `/admin/login` sind über Supabase Auth + Middleware geschützt
  (E-Mail/Passwort). Kein Selbstregistrierungs-Flow — Accounts werden manuell im Supabase-Dashboard
  angelegt.
- **Admin-Bearbeitung:** als Inline-Editing auf der Live-Seite umgesetzt für Site-Texte, About-Fakten,
  About-Stack, Home-Fakten-Karten (Rolle/Standort/Schwerpunkt) und Build-Log-Meilensteine — inklusive
  Hinzufügen/Löschen/Umsortieren bei den Listen und Ein-Klick-Toggle für den Erledigt-Status bei
  Meilensteinen.
- **Noch offen:** Projekte (CRUD + Bild-Upload über Supabase Storage) und das Kontaktformular
  (Server-seitiger Insert-Endpoint + Admin-Ansicht der Einsendungen) sind noch nicht umgesetzt — siehe
  „Offene Punkte". Beide sollten dem gleichen Inline-Editing-Muster folgen statt einer separaten
  Verwaltungsseite.

## Ausgangslage (Input für die Umsetzung)

Im Projekt liegt eine Datei `Florian Dehm - Homepage.dc.html` (+ `support.js`) — das ist der
**Design-Export aus Claude Design**, kein produktionsreifer Code. Er nutzt eine proprietäre
Template-Syntax (`<x-dc>`, `<sc-if>`, `<sc-for>`, `{{ variable }}`, `style-hover="..."`), die es
in echtem React/Next.js so nicht gibt.

**Wichtig:** Diese Syntax 1:1 übernehmen zu wollen funktioniert nicht. Stattdessen:
- Visuelles Design, Layout, Abstände, Typografie, Farbpaletten (Light/Dark) und Animationen/
  Übergänge exakt nachbauen
- `sc-if` → bedingtes Rendern in React (`{condition && <>...}` bzw. Routing)
- `sc-for` → `.map()` über echte Datenquellen (siehe Datenmodell unten) statt fest codierter Arrays
- `style-hover` → CSS-Klassen oder styled-components/Tailwind mit `:hover`
- Die Copy-Texte (DE + EN) aus dem `COPY`-Objekt in der Quelldatei sind die inhaltliche
  Wahrheit für den Erstimport — danach sollen sie aus der Datenbank kommen, nicht mehr hart codiert sein

## Tech-Stack (Zielarchitektur)

- **Framework:** Next.js (App Router), TypeScript
- **Styling:** CSS-Module oder Tailwind — Design-Tokens (siehe unten) als CSS-Variablen übernehmen,
  nicht als beliebige Zahlenwerte neu erfinden
- **Datenbank:** Supabase (Postgres) — strukturierte Inhalte in Tabellen, siehe Datenmodell unten
- **Datei-Uploads:** Supabase Storage (eigener Bucket für Projekt-Screenshots u. ä.), nicht separat
  von der DB verwaltet
- **Auth:** Supabase Auth (E-Mail/Passwort) fürs Admin-Panel — echte Session, serverseitig via
  Supabase-Client geprüft (z. B. Middleware/Server Components), kein selbstgebautes Session-Handling
  und kein Default-Secret in Produktion — siehe Security-Hinweise unten
- **Deployment:** Vercel

**Supabase-Setup:** Projekt ist angelegt, Schema + RLS liegen als Migrationen in
`supabase/migrations/` (siehe Datenmodell unten). Verbindungsdaten (`NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) liegen ausschließlich als
Umgebungsvariablen (lokal `.env.local`, gitignored; in Produktion Vercel Environment Variables) —
Werte stehen im Supabase-Dashboard unter Project Settings → API. Für die bisher umgesetzten Features
reicht die authentifizierte Nutzer-Session plus RLS aus; der Service-Role-Key wird aktuell von
keinem Feature gebraucht und darf, sobald er gebraucht wird, nie im Client-Bundle landen — nur in
Server-seitigem Code (Route Handlers/Server Actions).

## Design-System (aus dem Export zu übernehmen)

**Fonts:** `Inter Tight` (400/500/600) für Fließtext, `IBM Plex Mono` (400/500) für Labels/Meta-Infos,
via Google Fonts.

**Farb-Tokens (CSS Custom Properties, pro Theme):**
```
Light: --bg #eceae4 --panel #f8f7f4 --ink #1c1b16 --ink-2 #5c5a51 --ink-3 #8b8980
       --line #dbd8d0 --line-2 #e4e1d9 --soft #e3e0d8
       --accent oklch(0.53 0.11 152) --accent-soft oklch(0.9 0.045 152)

Dark:  --bg #1c1c1a --panel #262624 --ink #f0efea --ink-2 #a8a69d --ink-3 #7c7a72
       --line #373733 --line-2 #302f2c --soft #2e2e2b
       --accent oklch(0.75 0.12 152) --accent-soft oklch(0.34 0.05 152)
```
Theme-Wahl aktuell per `localStorage` (Key `fd-home`) persistiert — das Verhalten (inkl.
Default-Theme) soll erhalten bleiben, auch wenn Inhalte künftig aus der DB kommen.

**Look & Feel:** Ruhige, reduzierte Ästhetik, viel Weißraum, sanfte Hover-Übergänge (~160–220ms),
weiche "Glow"-Orbs im Hintergrund mit Parallax-Scroll-Effekt, abgerundete Cards (14–26px
Border-Radius). Diese Feinheiten sind Teil der Identität der Seite — bei der Umsetzung nicht
vereinfachen oder weglassen, nur technisch sauberer implementieren.

## Datenmodell (Basis für Admin-Panel + DB)

Alles, was aktuell als hart codiertes Array/Objekt in der Export-Datei steht, soll editierbar werden:

| Bereich | Enthält | Felder (pro Eintrag) |
|---|---|---|
| **Site-Texte** | Hero, About-Absätze, Section-Labels, Tab-Labels, CTA-Beschriftungen | Key, DE-Text, EN-Text |
| **Home – Fakten-Karten** | Kurzform auf dem Home-Tab: Rolle, Standort, Schwerpunkt | Label (DE/EN), Wert (DE/EN), Reihenfolge |
| **About – Fakten-Tabelle** | Rolle, Unternehmen, Lehrjahr, Standort, Schwerpunkt | Label (DE/EN), Wert (DE/EN), Reihenfolge |
| **About – Stack/Tags** | z. B. C++, Python, SQL, Git, Linux, HTML/CSS, JavaScript | Name, Icon (optional), Reihenfolge |
| **Projekte** | Titel, Kurzbeschreibung, Langtext (2 Absätze), Rolle, Jahr, Tech-Tags, Repo-Link, Screenshot/Bild | alle Felder DE/EN wo zutreffend, Bild-Upload (Supabase Storage, Pfad in der Tabelle referenziert) |
| **Build-Log / Meilensteine** | Titel, Notiz, Datum, erledigt (ja/nein) | DE/EN, Reihenfolge, Fortschritt wird daraus berechnet |
| **Kontakt** | Formular-Einsendungen | Name, E-Mail, Nachricht, Zeitstempel |

Jeder Text-Inhalt existiert **zweisprachig** (DE/EN) — das Admin-Panel muss beide Sprachen pro
Eintrag anzeigen und editierbar machen, nicht nur eine. Home-Fakten-Karten und About-Fakten-Tabelle
sind bewusst getrennte Tabellen (unterschiedliche Listen, unterschiedliche Länge), auch wenn ihre
Feldstruktur identisch ist.

**Umsetzung als Supabase-Tabellen:** eine Tabelle pro Bereich oben (`site_texts`, `home_facts`,
`about_facts`, `about_stack`, `projects`, `milestones`, `contact_submissions`), Reihenfolge als
`order`-Spalte (Integer), zweisprachige Felder als getrennte `_de`/`_en`-Spalten (nicht als
JSON-Blob, damit sie im Supabase Table Editor direkt lesbar/editierbar bleiben). Row Level Security
(RLS) aktivieren: öffentliches Lesen für alle Content-Tabellen, Schreiben nur für authentifizierte
Admin-User; `contact_submissions` weder öffentlich lesbar noch direkt vom Client beschreibbar (nur
über einen Server-seitigen Endpoint, siehe Security-Hinweise). `site_texts`, `home_facts`,
`about_facts`, `about_stack` und `milestones` sind bereits so angelegt und befüllt; `projects` und
`contact_submissions` existieren als Tabellen, aber ohne zugehöriges Admin-UI (siehe „Aktueller
Stand").

## Admin-Panel — Anforderungen

- Geschützt durch Supabase Auth (E-Mail/Passwort) — kein Zugriff ohne gültige Supabase-Session,
  serverseitig via Middleware geprüft
- CRUD für: Projekte, Build-Log-Meilensteine, About-Tags/Stack, About-Tabelle, Home-Fakten-Karten,
  alle Fließtexte
- Bild-Upload für Projekt-Screenshots über Supabase Storage (aktuell nur Platzhalter-Muster im Design)
- Kontaktformular-Einsendungen werden vorerst nur gespeichert (Tabelle `contact_submissions`) und im
  Admin-Panel einsehbar gemacht — kein E-Mail-Versand in der ersten Version
- Änderungen sollen sofort (oder nach Republish) auf der Live-Seite sichtbar sein
- Reihenfolge von Listen (Projekte, Meilensteine, Tags) muss änderbar sein (z. B. Drag-and-drop
  oder ein einfaches Sortierfeld)

### Umsetzung: Inline-Editing statt separatem Dashboard

Die Admin-Oberfläche ist bewusst **kein** klassisches CMS-Dashboard (Liste + Formular auf einer
eigenen Seite), sondern die Live-Seite selbst im Bearbeitungsmodus. Wer eine neue editierbare
Inhaltsfläche baut, sollte diesem Muster folgen statt eine neue Verwaltungsseite anzulegen:

- `/admin` (Middleware-geschützt) rendert dieselbe `SiteShell`-Komponente wie die öffentliche
  Startseite `/` — gleiches Layout, gleiche vier Tabs, gleiches Design, keine separate Seite pro
  Inhaltstyp.
- Ein `EditModeContext` (`components/admin/EditContext.tsx`) schaltet pro Request um:
  `editable=false` auf `/`, `editable=true` auf `/admin`. Dieselben Komponenten
  (`HomeSection`, `AboutSection`, `ProjectsSection`, `CurrentSection`, `Header`) rendern in beiden
  Fällen identisch — nur mit zusätzlichen Editier-Elementen, wenn `editable=true`. Die öffentliche
  Seite bleibt dadurch garantiert frei von Admin-UI, unabhängig vom Auth-Status des Betrachters.
- Jeder editierbare Text bekommt ein kleines Stift-Icon; ein Klick öffnet ein Inline-Popover direkt
  an der Textstelle mit DE- und EN-Feld nebeneinander plus Speichern/Abbrechen — kein Seitenwechsel,
  keine Tabellen-Ansicht.
- Listen (About-Fakten, About-Stack, Home-Fakten, Meilensteine) bekommen zusätzlich ↑/↓ zum
  Umsortieren, ✕ zum Löschen und einen „+ Add …“-Trigger am Listenende, alles direkt im Layout.
- Beim Build-Log lässt sich der Erledigt-Status zusätzlich per einfachem Klick auf den Kreis
  umschalten, ohne Popover — das ist die Aktion, die am häufigsten gebraucht wird.
- Alle Schreibzugriffe laufen über Next.js Server Actions (`app/admin/actions.ts`), die den
  server-seitigen Supabase-Client mit der authentifizierten Nutzer-Session verwenden. RLS erzwingt
  serverseitig, dass nur eingeloggte Admins schreiben können — dafür ist kein Service-Role-Key nötig.
- Wiederverwendbare Bausteine liegen unter `components/admin/`:
  - `EditableText` — ein einzelnes Textfeld (DE/EN) direkt an seiner Stelle im Layout
  - `EditableWrap` — für Text innerhalb eines bestehenden Links/Buttons (z. B. CTA-Beschriftungen),
    wo das Stift-Icon als Geschwister-Element statt verschachtelt gerendert werden muss
  - `EditableAboutFacts`, `EditableStackTags`, `EditableHomeFacts`, `EditableMilestones` — Listen
    mit Sortieren/Löschen/Hinzufügen im jeweiligen Layout der öffentlichen Sektion
  - `EditPopover` — das gemeinsame Popover-Layout (Felder + Speichern/Abbrechen), von allen oben
    genannten Komponenten wiederverwendet
- Projekte (inkl. Bild-Upload) und das Kontaktformular-Postfach sind noch nicht nach diesem Muster
  umgesetzt.

## Security-Hinweise für Claude Code

- Admin-Login läuft über Supabase Auth — kein selbstgebautes Passwort-Handling, kein
  Default-Passwort/-Secret in Produktion; alle Supabase-Keys ausschließlich über Umgebungsvariablen,
  nie im Code
- `SUPABASE_SERVICE_ROLE_KEY` nur in Server-seitigem Code (Route Handlers/Server Actions) verwenden,
  niemals im Client-Bundle oder in `NEXT_PUBLIC_*`-Variablen
- Row Level Security auf allen Supabase-Tabellen aktivieren (siehe Datenmodell) — nicht auf
  Anwendungscode allein als Zugriffsschutz verlassen
- Kontaktformular: Server-seitige Validierung, Rate-Limiting gegen Spam, keine Rohdaten
  ungefiltert in der DB weiterreichen; Insert nur über einen Server-seitigen Endpoint, nicht direkt
  vom Client gegen Supabase
- Datei-Uploads (Bilder) auf Dateityp/-größe prüfen, keine ausführbaren Dateien akzeptieren, bevor
  sie in Supabase Storage landen
- `.env`-Dateien nie lesen/committen lassen (in `.claude/settings.json` entsprechend sperren)

## Konventionen

- Sprache im Code (Variablen, Kommentare, Commit-Messages): Englisch
- Sprache der Inhalte: Deutsch + Englisch, wie im bestehenden `COPY`-Objekt vorgegeben
- Commits klein und beschreibend halten, pro Arbeitsschritt (z. B. "Add project data model",
  "Add admin auth", "Wire up contact form")
- Bestehende Copy-Texte aus der Export-Datei als Erstbefüllung der Datenbank verwenden,
  nicht neu erfinden

## Offene Punkte (bewusst noch nicht entschieden)

- Ob Kontaktformular-Einsendungen später (nach der ersten Version) zusätzlich per E-Mail
  weitergeleitet werden sollen, statt nur gespeichert zu werden

## Noch nicht umgesetzt

- **Projekte:** Tabelle `projects` existiert und ist befüllt, aber es gibt noch kein Admin-UI dafür
  (weder Bearbeiten von Titel/Text/Tech-Tags noch Bild-Upload über Supabase Storage). Sollte dem
  Inline-Editing-Muster oben folgen — vermutlich mit dem Projekt-Modal/den Projekt-Karten als
  Editier-Oberfläche statt einer separaten Liste.
- **Kontaktformular:** Tabelle `contact_submissions` existiert mit RLS (kein Client-Zugriff), aber
  weder der Server-seitige Insert-Endpoint für das öffentliche Formular noch eine Admin-Ansicht der
  Einsendungen sind gebaut.
