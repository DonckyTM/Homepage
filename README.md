# Florian Dehm — Personal Homepage

My personal site: who I am, what I'm working on, and an honest build log of this project itself.

Live source of truth for the design lives in [Claude Design](https://claude.ai/design); this repo is the hand-built implementation — plain HTML/CSS/JS, no framework, no build step.

## Structure

```
index.html   markup for header, four tabs (Home / About / Projects / Current), modal, footer
style.css    design tokens (light + dark), layout, components
script.js    tab routing, EN/DE copy, theme toggle, project modal, progress calculation
```

State (language, theme) is kept in `localStorage` under the key `fd-home`. There is no backend and no external dependencies besides Google Fonts (Inter Tight, IBM Plex Mono).

## Running locally

Any static file server works. For example:

```bash
python3 -m http.server 8843
```

Then open `http://localhost:8843`. A matching [`.claude/launch.json`](.claude/launch.json) config is included for previewing inside Claude Code.

## Deploying

The site is fully static — push `index.html`, `style.css`, and `script.js` to any static host (GitHub Pages, Netlify, Vercel, etc.). No build step required.
