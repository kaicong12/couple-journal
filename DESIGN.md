# Sienna Heirloom — Design System

**North star: "The Digital Curator."** Digital content treated as a physical archive — a high-end travel journal, not a tech product. Warm, editorial, tactile: serif display type, parchment surfaces, generous whitespace, soft ambient shadows. Boundaries are felt (surface shifts), not seen (no hard borders).

## Color

| Token | Hex | Role |
|---|---|---|
| `parchment` | `#F7F5F0` | app background ("the desk") |
| `paper` | `#FBFAF6` | cards ("the paper") |
| `surface-warm` / `surface-deep` | `#EFE9DF` / `#E5DDD0` | tinted bands, bar tracks |
| `text` (ink) | `#2A2521` | primary text, selected chips, dark toast |
| `ink-soft` / `muted-text` | `#5C5048` / `#8E867E` | secondary / metadata text |
| `sienna` / `sienna-dark` / `sienna-deep` | `#B48261` / `#9A6A4E` / `#966548` | brand, primary actions |
| `accent-warm` | `#E3D8CE` | borders, inputs |
| `sage` | `#7B9A87` | success, Gmail badges |
| `rose` | `#B07A6B` | soft-destructive (remove) |

Category palette (Spending): Eating out `#C0764A` · Groceries `#8F9A6E` · Transport `#708BA4` · Date night `#B07A6B` · Travel `#5C7064` · Gifts `#C09A4F` · Home `#9C8A78`.

Avatar gradients: You `#C9A788→#6F4B36`, Mira `#B07A6B→#7A4A3A`.

No saturated "digital" colors (bright blues, neons, material greens/reds).

## Typography

- **Display:** Newsreader (serif) — headings (h1–h6 automatically), money amounts, merchant names. `font-display`.
- **Body:** DM Sans — 16px/1.6.
- **Metadata:** 10–11px uppercase, tracked (`tracking-[0.13em]`–`[0.14em]`), muted, bold — dates, labels, button text.

## Depth & shape

- `shadow-soft`: `0 10px 40px -10px rgba(42,37,33,0.08)` (hover: `0 15px 50px -10px / 0.12`). Cards = `bg-paper rounded-sm shadow-[var(--shadow-soft)]` — never hard borders; separators are hairlines (`border-black/5`) or `border-accent-warm/50`.
- Radii: 4px (`rounded-sm`) for buttons/cards, full for chips/pills/avatars.
- Hover: slight scale (1.02) + deeper shadow — a photograph lifting off the desk.

## Component idioms

- **Buttons:** "archival stamps" — sienna (warm) or ink fill, `rounded-sm text-[11px] font-bold uppercase tracking-[0.13em]`. Ghost = paper bg + `border-accent-warm`.
- **Chips/pills:** `rounded-full`, uppercase 10–11px; selected = ink fill (filters) or sienna fill (split pills).
- **Badges:** sage pill for Gmail/success (`bg-sage/15 text-sage`), sienna pill for splits.
- **Inputs:** parchment or ghost fill, focus ring shifts to sienna.
- **Lists:** one paper card-table with parchment day-divider bands, hairline rows, category dots, serif names/amounts.
- **Toasts:** dark ink card, sienna spark icon, serif amounts.

## Sources of truth

- Tokens: `src/index.css` (`@theme` + shadcn `:root` vars).
- Hi-Fi mockups: **Couple Journal** project on claude.ai/design.
- Synced design system (real components): **Couple Journal UI** on claude.ai/design — `.design-sync/conventions.md` documents the agent-facing rules, including: only Tailwind classes used in `src/` exist in the compiled CSS.
