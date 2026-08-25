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

### Environment variables

Copy `.env.local.example` to `.env.local` and fill in the values from your Supabase project's
dashboard (Project Settings → API):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your project's API URL. Safe to expose in the client bundle. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The public anon key, used by the browser client (`lib/supabase/client.ts`). Safe to expose in the client bundle. |
| `SUPABASE_SERVICE_ROLE_KEY` | The service role key, from Project Settings → API → service_role. **Server-side only** — never use it in client components or in a `NEXT_PUBLIC_*` variable, since it bypasses Row Level Security. |

`.env.local` is git-ignored and never committed.

## Deployment

Target platform is Vercel — connect the repo and it builds with the default Next.js settings, no
extra config required.

Set these as **Environment Variables** in the Vercel project settings (Project → Settings →
Environment Variables), for Production (and Preview, if you want preview deployments to hit the
same Supabase project) — the same three variables from `.env.local.example` above:

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your project's API URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The public anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | The service role key. Mark it **sensitive** in Vercel — it must never be exposed to the browser (it isn't referenced by any client code; see [CLAUDE.md](CLAUDE.md)'s security notes). |

These must be set in the Vercel project, not committed to the repo — `.env.local` stays
git-ignored and is only used for local development.

`/` is statically prerendered at build time and fetches its content from Supabase during that
prerender (see [CLAUDE.md](CLAUDE.md)), so `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` need to be available at **build time**, not just at runtime — set
them for the Production environment before the first deploy, or the build will fail while
prerendering `/`.
