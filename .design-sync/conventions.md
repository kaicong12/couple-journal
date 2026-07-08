# Couple Journal UI — Sienna Heirloom conventions

Warm-editorial design system ("digital curator" / high-end travel journal): parchment surfaces, sienna accents, Newsreader serif display type, soft ambient shadows, no hard borders.

## Setup

No provider or wrapper is required — components work standalone. `styles.css` applies the base look globally: body text is **DM Sans** on a `#F7F5F0` parchment background; `h1–h6` automatically render in **Newsreader** serif. Both font families ship with the bundle.

## Styling idiom — Tailwind utilities, but ONLY shipped ones

The stylesheet is compiled Tailwind CSS v4: **only class names that appear below or in the component sources exist — an arbitrary Tailwind class you invent will silently do nothing.** For layout glue (grids, gaps, one-off spacing/sizing), use inline `style={{…}}` instead of guessing class names.

Verified utility vocabulary (all present in `_ds_bundle.css`):

| Family | Classes |
|---|---|
| Surfaces | `bg-parchment` (#F7F5F0 desk), `bg-paper` (#FBFAF6 cards), `bg-surface-warm`, `bg-surface-deep` |
| Brand | `bg-sienna`, `text-sienna`, `text-sienna-deep`, `bg-sage`, `text-sage` (Gmail/success), `text-rose` (destructive-soft) |
| Ink | `text-text` (#2A2521), `text-ink-soft`, `text-muted-text` |
| Semantic (shadcn) | `bg-primary` (sienna), `text-primary-foreground`, `bg-background`, `text-foreground`, `border-border` |
| Type | `font-display` (Newsreader serif — use for amounts, titles, merchant names) |
| Shape | `rounded-sm` (4px — buttons/cards), `rounded-full` (chips, avatars), `border-accent-warm` |
| Depth | `shadow-[var(--shadow-soft)]` — the house card shadow; never use hard borders to separate cards |

House styles: primary buttons are "archival stamps" — sienna or ink fill with `text-[11px] font-bold uppercase tracking-[0.13em]` labels. Metadata labels are tiny uppercase tracked sans (`text-[10px] uppercase tracking-[0.14em] text-muted-text font-bold`). Money and headings are serif via `font-display`.

## Where the truth lives

- `styles.css` → imports `_ds_bundle.css` (all compiled utilities + component styles) and `fonts/fonts.css`.
- Per-component API + usage: each `components/<group>/<Name>/<Name>.prompt.md` and `.d.ts`.

## Idiomatic example

```jsx
const { Button, Input, Label, Avatar } = window.CoupleJournal;

<div className="bg-paper rounded-sm shadow-[var(--shadow-soft)]" style={{ padding: 24, maxWidth: 420 }}>
  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-text font-bold">This month · so far</p>
  <p className="font-display" style={{ fontSize: 36 }}>
    <span className="text-muted-text" style={{ fontSize: 18 }}>S$</span>1,486.20
  </p>
  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
    <Avatar who="you" /> <span className="text-ink-soft" style={{ fontSize: 13 }}>You · S$862</span>
  </div>
  <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
    <Button variant="outline" className="rounded-sm text-[11px] font-bold uppercase tracking-[0.13em] bg-paper">Cancel</Button>
    <Button className="rounded-sm text-[11px] font-bold uppercase tracking-[0.13em]">Add Expense</Button>
  </div>
</div>
```
