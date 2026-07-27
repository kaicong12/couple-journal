# Couple Journal

A private web app for the two of us — part event planner, part shared scrapbook,
styled like a warm editorial travel journal.

## Features

**Our Story** (`/`) — the landing page: hero photo, letters, and favourite
moments.

**Events** (`/events`) — a gallery of our memories. Each card has a photo
carousel, date, location, and categories. Fuzzy search, category and date-range
filters, and sorting. Events are created through a 3-step wizard (photos → when
& where → the story), with AI-generated captions, Google Places autocomplete for
locations, a detail page per event, and a 4-step edit wizard.

**Us** (`/us`) — a running count of our days together, plus upcoming milestones
with live countdowns. Milestones can repeat yearly or monthly and are added,
edited, and deleted from the same page.

**Sign-in** — Google auth, limited to our two accounts.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
```

`npm run build` produces a production build in `dist/`; deployment goes to
Vercel.

Set `VITE_OPENROUTER_API_KEY` in a `.env` file for AI caption generation.

## Stack

React 18 + Vite, Firebase (Auth, Firestore, Storage), Tailwind CSS v4 with
shadcn/ui, and some legacy Chakra UI still being migrated. Design tokens and
conventions live in [`CLAUDE.md`](./CLAUDE.md).
