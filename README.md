# Couple Journal

A private journal app for two: a shared story page, event planning with photos + AI captions, and a shared SGD spending tracker. Styled after the [Sienna Heirloom design system](DESIGN.md).

Sign-in is Google-only (Firebase Auth) against an email whitelist. When logged out or Firestore is empty, Spending falls back to mock data so the UI stays browsable in dev.

## Stack

React 18 + Vite (JavaScript) · shadcn/ui + Tailwind CSS v4 (new UI) · Chakra UI v2 (legacy, being migrated) · Firebase (Auth, Firestore, RTDB) · Recoil · Fuse.js · OpenAI SDK

## Commands

```bash
npm ci
npm run dev      # http://localhost:3000
npm run build    # production build
npm run preview
```

## Layout

- `src/Pages/` — features (OurStory, EventsList, Spending, …), one dir per page
- `src/Components/ui/` — shadcn primitives · `src/Components/` — legacy Chakra
- `src/db/` — Firebase helpers · `src/index.css` — Tailwind entry + design tokens
- `docs/superpowers/specs/` — feature specs · `.design-sync/` — Claude Design sync
- [DESIGN.md](DESIGN.md) — design system · [CLAUDE.md](CLAUDE.md) — AI agent instructions

## Design

Hi-Fi mockups live in the **Couple Journal** project on claude.ai/design; the **Couple Journal UI** project is this repo's design system, synced via `/design-sync` (config in `.design-sync/`).
