# Couple Journal

React couple's app: shared story page, event planning, and a shared SGD spending tracker. See [README.md](README.md) for an overview and [DESIGN.md](DESIGN.md) for the full Sienna Heirloom design system.

## Tech stack

- React 18 (Vite), JavaScript — `.jsx` for components, `.js` otherwise
- shadcn/ui (base-nova) + Tailwind CSS v4 — **all new UI**
- Chakra UI v2 — legacy, migrate incrementally, never use for new code
- Firebase (Auth, Firestore, RTDB), Recoil, Framer Motion, Fuse.js, OpenAI SDK, Lucide icons

## Commands

- `npm run dev` — dev server on port 3000
- `npm run build` — production build
- `npm run preview` — preview production build

## Structure

- `src/Pages/<Feature>/` — page features; `index.jsx` entry, co-located components in `Components/`
- `src/Components/ui/` — shadcn primitives (button, calendar, dialog, input, label, popover, select). Note the capital-C `Components` — imports use `@/Components/ui/...` (`@/` → `./src/`, alias in `vite.config` + `jsconfig.json`)
- `src/db/` — firebase.js, firestore.js, rtdb.js · `src/hooks/` · `src/recoil/` · `src/utils/` · `src/Icons/`
- `src/index.css` — Tailwind v4 entry, Sienna Heirloom tokens (`@theme`), shadcn CSS vars
- `src/routes.js`, `src/AuthContext.jsx`, `src/PrivateRoute.jsx`
- `docs/superpowers/specs/` — feature design specs

## Design rules (details in DESIGN.md)

- Palette: parchment `#F7F5F0` bg, paper `#FBFAF6` cards, ink `#2A2521`, sienna `#B48261` brand, sage `#7B9A87` success, rose `#B07A6B` soft-destructive. Never bright/material colors.
- Newsreader serif for headings/amounts (`font-display`), DM Sans body, tiny uppercase tracked metadata labels.
- Cards: `bg-paper rounded-sm shadow-[var(--shadow-soft)]` — no hard borders; hairline separators only.
- Buttons: uppercase tracked "archival stamp" labels (`text-[11px] font-bold uppercase tracking-[0.13em]`).

## Gotchas

- `App.css` sets `.App { text-align: center }` — new pages must add `text-left` on their root.
- Auth is a Google popup + email whitelist; it can't be automated. For browser verification, the user logs in manually. Logged out / empty Firestore → Spending uses mock data (`src/Pages/Spending/mockData.js`).
- Dates: build `YYYY-MM-DD` from local date parts, never `toISOString()` (UTC off-by-one in SGT).
- The design agent's synced CSS is compiled Tailwind — only classes already used in `src/` exist.

## Claude Design / design-sync

- **Couple Journal** project = Hi-Fi feature mockups (design source of truth).
- **Couple Journal UI** project = this repo's synced design system. Config, authored previews, and repo gotchas live in `.design-sync/` (read `.design-sync/NOTES.md` before re-syncing; new DS components must be added to both `ds-entry.mjs` and `componentSrcMap`).

## Conventions

- New components: shadcn/ui + Tailwind, composed from `src/Components/ui` primitives.
- Feature-specific logic stays inside its page directory; genuinely shared pieces graduate to `src/Components/`.
- Follow the existing wizard/dialog patterns in Events and Spending when adding flows.
