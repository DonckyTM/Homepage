# Florian Dehm — Personal Homepage

## Projektüberblick

Persönliche Portfolio-/Homepage von Florian Dehm, Softwareentwickler-Azubi (3. Lehrjahr) bei der
Deutschen Börse in Frankfurt am Main, Schwerpunkt Backend & C++.

Die Seite hat vier Tabs: **Home, About, Projects, Current** (Build-Log). Sie ist durchgehend
zweisprachig (DE/EN) und unterstützt Light/Dark Mode.

**Zielzustand:** Eine vollwertige Next.js-App mit Datenbank-Backend und einer passwortgeschützten
Admin-Oberfläche, über die Florian **alle** Inhalte selbst pflegen kann — Texte, Bilder, Icons,
About-Tags/Stack, Timeline und Build-Log-Meilensteine — ohne Code anzufassen.

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
- **Datenbank:** Von Claude Code vorschlagen lassen (z. B. Supabase/Postgres) — muss Bilder/Dateien
  (Uploads) und strukturierte Inhalte gleichermaßen abbilden können
- **Auth:** Einfacher, aber echter Login fürs Admin-Panel (kein Klartext-Passwort im Code, kein
  Default-Secret in Produktion — siehe Security-Hinweise unten)
- **Deployment:** Vercel

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
| **Site-Texte** | Hero, About-Absätze, Section-Labels | Key, DE-Text, EN-Text |
| **About – Fakten-Tabelle** | Rolle, Unternehmen, Lehrjahr, Standort, Schwerpunkt | Label (DE/EN), Wert (DE/EN), Reihenfolge |
| **About – Stack/Tags** | z. B. C++, Python, SQL, Git, Linux, HTML/CSS, JavaScript | Name, Icon (optional), Reihenfolge |
| **Projekte** | Titel, Kurzbeschreibung, Langtext (2 Absätze), Rolle, Jahr, Tech-Tags, Repo-Link, Screenshot/Bild | alle Felder DE/EN wo zutreffend, Bild-Upload |
| **Build-Log / Meilensteine** | Titel, Notiz, Datum, erledigt (ja/nein) | DE/EN, Reihenfolge, Fortschritt wird daraus berechnet |
| **Kontakt** | Formular-Einsendungen | Name, E-Mail, Nachricht, Zeitstempel |

Jeder Text-Inhalt existiert **zweisprachig** (DE/EN) — das Admin-Panel muss beide Sprachen pro
Eintrag anzeigen und editierbar machen, nicht nur eine.

## Admin-Panel — Anforderungen

- Geschützt durch echten Login (nicht per Klick-Konvention, sondern serverseitig geprüfte Session/Token)
- CRUD für: Projekte, Build-Log-Meilensteine, About-Tags/Stack, About-Tabelle, alle Fließtexte
- Bild-Upload für Projekt-Screenshots (aktuell nur Platzhalter-Muster im Design)
- Änderungen sollen sofort (oder nach Republish) auf der Live-Seite sichtbar sein
- Reihenfolge von Listen (Projekte, Meilensteine, Tags) muss änderbar sein (z. B. Drag-and-drop
  oder ein einfaches Sortierfeld)

## Security-Hinweise für Claude Code

- Admin-Login niemals mit Default-Passwort/-Secret ausliefern; Secrets ausschließlich über
  Umgebungsvariablen, nie im Code
- Kontaktformular: Server-seitige Validierung, Rate-Limiting gegen Spam, keine Rohdaten
  ungefiltert in der DB oder per E-Mail weiterreichen
- Datei-Uploads (Bilder) auf Dateityp/-größe prüfen, keine ausführbaren Dateien akzeptieren
- `.env`-Dateien nie lesen/committen lassen (in `.claude/settings.json` entsprechend sperren)

## Konventionen

- Sprache im Code (Variablen, Kommentare, Commit-Messages): Englisch
- Sprache der Inhalte: Deutsch + Englisch, wie im bestehenden `COPY`-Objekt vorgegeben
- Commits klein und beschreibend halten, pro Arbeitsschritt (z. B. "Add project data model",
  "Add admin auth", "Wire up contact form")
- Bestehende Copy-Texte aus der Export-Datei als Erstbefüllung der Datenbank verwenden,
  nicht neu erfinden

## Offene Punkte (bewusst noch nicht entschieden)

- Genaue Wahl der Datenbank/des Hosting-Anbieters für Bild-Uploads
- Ob Admin-Login einfaches Passwort oder vollwertiges Auth-System (z. B. NextAuth) sein soll
- Ob Kontaktformular-Einsendungen nur gespeichert oder zusätzlich per E-Mail weitergeleitet werden sollen
