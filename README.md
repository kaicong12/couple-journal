# Couple Journal

A private web app for a couple to plan events and keep a shared story — a digital
scrapbook styled after a warm editorial travel journal (the "Sienna Heirloom"
design system).

## Features

- **Our Story** (`/`) — a curated landing page with hero, letters, and photos.
- **Events** (`/events`) — a searchable, filterable gallery of memories. Each
  event card carries an image carousel, date, location, categories, and an
  AI-generated caption. Add via a multi-step wizard, view detail pages, and edit
  through a 4-step wizard.
- **Us** (`/us`) — a days-together counter, relationship stats, and upcoming
  milestones (one-off, yearly, or monthly).
- **Auth** — Google sign-in gated by an email whitelist stored in Firebase
  Realtime Database.

## Tech Stack

- **React 18** + **Vite** (JavaScript, no TypeScript)
- **Chakra UI v2** (legacy — being migrated) + **shadcn/ui** on **Tailwind CSS v4** (new components)
- **Firebase** — Auth, Firestore (events, milestones, couple profile), Realtime Database (whitelist), Storage (photos)
- **Recoil** (`RecoilRoot` is mounted; no atoms are defined yet)
- **Framer Motion** for animations
- **Fuse.js** for fuzzy event search
- **OpenRouter** (via the OpenAI SDK) for AI caption generation
- **Google Places API** for location autocomplete
- **Lucide React** (shadcn) and **Font Awesome** for icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
npm install
```

Create a `.env` file in the project root with the following variables:

```bash
# OpenRouter key for AI caption generation
VITE_OPENROUTER_API_KEY=your_openrouter_key
```

> **Note:** Firebase web config lives in `src/db/firebase.js`. This is public web
> config (safe to ship) rather than a secret. The Google Places API key is
> currently hardcoded in `src/Pages/EventsList/Components/LocationSearchBox.jsx`
> and should be moved to an environment variable and referrer-restricted — see
> [Known issues](#known-issues).

### Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server on [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |

## Project Structure

```
src/
├─ Pages/                  # page-level features (co-located components)
│  ├─ OurStory/            # landing page ("/")
│  ├─ EventsList/          # event gallery ("/events")
│  ├─ EventDetail/         # single event ("/events/:id")
│  ├─ AddEvent/            # multi-step create wizard ("/events/new")
│  ├─ EditEvent/           # 4-step edit wizard ("/events/:id/edit")
│  ├─ Us/                  # days-together + milestones ("/us")
│  └─ Login/               # Google sign-in
├─ Components/             # shared components
│  └─ ui/                  # shadcn/ui primitives
├─ db/                     # Firebase config + data helpers (firebase, firestore, rtdb, index)
├─ hooks/                  # custom hooks (useDebounce, useModalParams)
├─ Icons/                  # custom SVG icon components
├─ lib/utils.js            # shadcn `cn` helper
├─ utils/                  # utilities (generateCaption, …)
├─ theme.js                # Chakra UI theme (legacy)
├─ routes.js               # nav route list
├─ AuthContext.jsx         # Firebase auth context
├─ PrivateRoute.jsx        # auth-guarded route wrapper
└─ App.jsx                 # router + top-level auth gate
```

Design tokens, conventions, and the full Sienna Heirloom design system are
documented in [`CLAUDE.md`](./CLAUDE.md).

## Deployment

Configured for **Vercel** (`vercel.json` sets the build output directory to
`dist`). `@vercel/analytics` is wired up in `App.jsx`.

## Known issues

A code review surfaced several issues worth addressing (see the code-review
output for details and line numbers):

- Google Places API key is hardcoded in client source — move to env + restrict.
- Events date-range filter crashes on events missing a `date` field.
- Events "Date" sort compares Timestamp objects (`b.date - a.date` → `NaN`) and is a no-op.
- `deleteEvent`/`updateEvent` only handle the `thumbnail`, orphaning multi-photo `photos[]` in Storage.
- App flashes the Login page on refresh (auth `loading` flag is ignored).
- Object-URL previews in the add/edit wizards are never revoked (memory leak).

## Roadmap

- A spending/expense-tracking feature is specified in
  [`docs/superpowers/specs/2026-07-07-spending-feature-design.md`](./docs/superpowers/specs/2026-07-07-spending-feature-design.md).
- Ongoing migration of legacy Chakra UI components to shadcn/ui + Tailwind.
