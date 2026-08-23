# Florian Dehm — Personal Homepage

My personal site: who I am, what I'm working on, and an honest build log of this project itself.

Live source of truth for the design lives in [Claude Design](https://claude.ai/design); this repo is the implementation — Next.js (App Router) with TypeScript.

## Structure

```
app/                 routes, root layout (fonts, global metadata), design tokens (globals.css)
components/          Header, per-tab sections, project modal, footer — each with a CSS Module
lib/types.ts         shared TypeScript types for the data model
lib/data/            typed content: site texts, about facts/stack, projects, build-log milestones
lib/useSiteState.ts  client-side state (tab, language, theme, modal) + the orb parallax hook
```

Content in `lib/data/` is bilingual (DE/EN) and shaped to match the data model in
[CLAUDE.md](CLAUDE.md) — the intent is that a future database/admin-panel layer can replace these
modules without touching the components that render them. There is no backend yet.

State (language, theme) is kept in `localStorage` under the key `fd-home`. No external
dependencies besides Google Fonts (Inter Tight, IBM Plex Mono).

## Running locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`. A matching [`.claude/launch.json`](.claude/launch.json) config
is included for previewing inside Claude Code.

## Deploying

Target platform is Vercel — connect the repo and it builds with the default Next.js settings, no
extra config required.
