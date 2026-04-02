# Couple Journal

A React couple's app with event planning and a shared story page.

## Tech Stack

- React 18 (Vite) with JavaScript
- Chakra UI v2 (legacy — being migrated to shadcn/ui + Tailwind CSS v4)
- shadcn/ui + Tailwind CSS v4 (new components use this)
- Firebase (Auth, Firestore, Realtime Database)
- Recoil for state management
- Framer Motion for animations
- Fuse.js for fuzzy search
- OpenAI SDK for AI features
- Lucide React for icons (shadcn default)

## Commands

- `npm run dev` — dev server (port 3000)
- `npm run build` — production build
- `npm run preview` — preview production build

## Project Structure

- `src/Pages/` — page-level features (EventsList, OurStory, Login)
- `src/components/ui/` — shadcn/ui components (button, dialog, input, select, label)
- `src/Components/` — shared Chakra components (legacy)
- `src/lib/utils.js` — shadcn utility (cn function)
- `src/db/` — Firebase config and database helpers (firebase.js, firestore.js, rtdb.js)
- `src/hooks/` — custom hooks
- `src/recoil/` — Recoil atoms
- `src/utils/` — utility functions
- `src/Icons/` — custom SVG icon components
- `src/theme.js` — Chakra UI theme config (legacy)
- `src/routes.js` — route definitions
- `src/AuthContext.jsx` — Firebase auth context
- `src/PrivateRoute.jsx` — auth-guarded route wrapper

## Theme & Design

# Sienna Heirloom Design System

### 1. Overview & Creative North Star
**Creative North Star: "The Digital Curator"**
Sienna Heirloom is a design system that treats digital content as a physical archive. It moves away from the sterile, high-tech aesthetic in favor of a "warm editorial" feel. The system prioritizes tactile warmth, sophisticated serif typography, and generous negative space to evoke the feeling of a high-end travel journal or a boutique gallery catalog. By utilizing intentional asymmetry and a restricted, earthy palette, it creates an environment where memories feel permanent and prestigious rather than ephemeral.

### 2. Colors
The palette is grounded in "Sienna" (#B48261) and "Parchment" (#F7F5F0), creating a low-fatigue, high-luxury reading experience.

* **Primary Role:** Used for brand signals and primary actions. It represents the "leather" of the scrapbook.
* **Neutral Tones:** Based on warm grays and off-whites to avoid the clinical feel of pure hex #FFF.
* **The "No-Line" Rule:** Sectioning is achieved through shifts in surface color (e.g., transitioning from `surface` to `surface_container_low`) rather than hard lines. Boundaries should be felt, not seen.
* **Surface Hierarchy:**
* **Lowest/Bright:** Reserved for the main content cards and active surfaces.
* **Container Tiers:** Used to differentiate the "desk" (background) from the "paper" (content).
* **The "Glass & Gradient" Rule:** Use subtle `backdrop-blur` (5-10px) on navigation bars to maintain context while scrolling, paired with an `outline-variant` at 50% opacity for a "ghost border" effect.

### 3. Typography
Sienna Heirloom utilizes a dual-font strategy to balance tradition and modernity.

* **Display & Headlines:** *Newsreader*. A sophisticated serif used for titles (28px) and branding (20px). It conveys authority and a "printed" quality.
* **Body & Labels:** *Plus Jakarta Sans* (or *DM Sans* as found in source). A clean, geometric sans-serif that ensures high legibility for long-form descriptions and metadata.
* **Typography Scale (Ground Truth):**
* **Hero Headlines:** 28px (Newsreader Medium) - Leading is tight (1.1) to create a visual block.
* **Sub-navigation:** 20px (Newsreader Bold).
* **Body Text:** 16px / 1rem (Sans) - Leading is relaxed (1.6) for readability.
* **Metadata/Labels:** 12px / 0.75rem or 14px / 0.875rem (Sans, Uppercase with 0.05em tracking).

### 4. Elevation & Depth
Depth is conveyed through soft, ambient environmental lighting rather than technical shadows.

* **Shadows (Ground Truth):**
* `shadow-soft`: `0 10px 40px -10px rgba(42, 37, 33, 0.08)`
* `shadow-soft-hover`: `0 15px 50px -10px rgba(42, 37, 33, 0.12)`
* **The Layering Principle:** Content cards (Surface Lowest) sit atop the background (Surface/Background Light).
* **Elevation via Scale:** On hover, elements should slightly scale (1.02) and deepen their shadow to simulate the "lifting" of a physical photograph.

### 5. Components
* **Buttons:** Rectangular with minimal rounding (4px). Primary buttons use the Sienna background with uppercase, tracked-out labels to mimic archival stamps.
* **Cards:** Clean edges, no borders. The separation is defined by the `shadow-soft` and the image-to-text ratio (ideally 3:2).
* **Chips/Tags:** Subdued backgrounds (`surface_container`) with muted text. They should feel like small annotations, not primary UI elements.
* **Inputs:** Minimalist bottom-border or ghost-contained styles. Focus states transition the icon color to Primary (#B48261).
* **Top Navigation:** Fixed, high-z-index surface with a subtle `accent` border-bottom to define the header space.

### 6. Do's and Don'ts
* **Do:** Use generous padding (p-8 on cards) to let the content breathe.
* **Do:** Maintain a 3:2 aspect ratio for imagery to keep a consistent visual rhythm.
* **Don't:** Use vibrant, saturated "digital" colors (bright blues, neons).
* **Don't:** Use heavy, dark borders. If a separator is needed, use `border-accent/50`.
* **Do:** Use uppercase for small metadata (dates, locations) to improve scanability while maintaining a refined aesthetic.

### Typography
- System font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`
- Code font: `source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace`
- shadcn default: Geist Variable (imported via `@fontsource-variable/geist`)

### shadcn/ui
- CSS variables defined in `src/index.css` (:root and .dark)
- Path alias: `@/` → `./src/`
- Components config: `components.json` at project root

## Conventions

- Pages use `index.jsx` as entry point with co-located components
- `.jsx` for components, `.js` for non-JSX modules
- New components should use shadcn/ui + Tailwind classes
- Legacy Chakra components will be migrated incrementally
- Feature-specific logic kept within page directories
