# design-sync notes — couple-journal

- This is an **app repo, not a component library**: no dist entry, no `.d.ts`. The sync surface is enumerated in `.design-sync/ds-entry.mjs` (committed) and pinned via `cfg.componentSrcMap` + `cfg.entry`. Add new design-system components in BOTH places.
- **CSS is compiled Tailwind v4** from `npm run build` (`cfg.buildCmd`): it copies `dist/assets/index-*.css` to `.design-sync/.cache/css/tailwind.css`, rewriting `url(/assets/…)` → `url(./…)` (sed step) so @font-face files resolve; the woff/woff2 files are copied next to it. Skipping the sed step causes `[FONT_DANGLING]`.
- Only Tailwind classes **used somewhere in `src/`** exist in the shipped CSS — previews and the conventions header must not use unshipped class names; layout glue in previews uses inline styles.
- `cfg.tsconfig` points at `jsconfig.json` for the `@/` → `./src/` alias used by `src/Components/ui/*`.
- Playwright for the render check: cached chromium build 1217 → **playwright@1.59.0** installed in `.ds-sync/`.
- Legacy Chakra components (`src/Components/SearchBar.jsx`, everything Chakra) are deliberately excluded — the repo is migrating to shadcn/ui + Tailwind (CLAUDE.md).
- **Code font decision (user-approved 2026-07-08):** `source-code-pro` in the `code` font stack is NOT shipped; the app itself always falls back to system mono (Menlo/Monaco), so the bundle does the same. `[FONT_MISSING] source-code-pro` is expected and accepted.

## Known render warns

- `[RENDER_THIN] Dialog` (`maxHeight: 0`): the dialog portals to `document.body`, so the preview root measures 0px. The card renders the full open dialog (verified on the review sheet, graded good). Expected on every sync.
- `[FONT_MISSING] source-code-pro`: accepted substitute, see above.

## Re-sync risks

- `.design-sync/.cache/css/tailwind.css` is **generated state**: always re-run `cfg.buildCmd` before the converter, or the shipped CSS silently lags the app (new utility classes used by new/changed components will be missing).
- SummaryCards preview inlines a `summary` fixture; if `useSpending`'s summary shape changes (e.g. `pctChange`/`prevMonthName` renamed), the preview renders wrong data silently — re-check it when touching `useSpending.js`.
- The Spending shared components (Avatar, SummaryCards, FilterChips, SyncToast) were first committed on `feature/spending-tracker` (PR #13). A sync run from `main` before that PR merges will fail to resolve them.
- Select previews show closed triggers only (open dropdown state not statically rendered); Calendar previews cover single-date mode only (range-middle fill is not visibly styled by the shipped CSS).
