# Phase 6 — Handoff & capture

Goal: hand a **complete** site back to the operator for last-mile QA, then — **only on their go** —
capture the screenshots.

## HITL checkpoint — STOP

**Do not capture yet.** This is the **one intentional pause** in the pipeline — the single human rule
the code can't enforce. Hand a **complete** site back (not a set of open questions) and wait.

Post a short, **point-form** handoff:

- **Review:** `yarn sites:dev <slug>` — walk every page.
- **Last-mile QA (operator's):** swap placeholder images (overwrite the PNGs in `public/images/` —
  each bakes in a description of the ideal content to source), replace any staged stats/quotes with
  real figures, tweak copy/layout to taste.
- **Typography (operator's):** the site's two typefaces live in `sites/<slug>/fonts.css` — one
  `@import` plus `--font-heading-family` / `--font-body-family`. Surface the brief's typography
  intent here as a suggestion and leave the choice to the operator. Keep it to a single `@import`
  (a CSS bundle drops the rest); `theme:build` never touches this file.
- **Site-local components:** run `yarn sites:novel <slug>` and include its output — for each block/
  section, its purpose, what tier fell short, and that it's a promote-to-core candidate (operator
  decides). Say so if the list is empty.
- **Core primitives** added via the shadcn MCP, if any — those are core changes to review.
- **Assumptions:** one line each on the design-notes decisions you made (especially for a thin brief),
  framed as *"here's what I decided; change it if you disagree."*
- **When you're ready, tell me and I'll run → `yarn capture:run <slug>`.**

Only proceed on the operator's explicit go.

## Capture

```bash
yarn capture:run <slug> [--run <name>] [--port <n>]   # default port 3210
```

Drives Chromium motion-free and writes full-page JPEGs to
`sites/<slug>/captures/<run>-<ts>/<page>_<width>.jpg` (one per page × viewport). **If a dev server is
already running** — e.g. the operator left `yarn sites:dev <slug>` up (port 3000) — capture **reuses
that instance** rather than spawning its own; it only starts (and later stops) a server when none is
found. Report the artifact paths. `captures/` is gitignored — these are the deliverable.

## Done condition

- Operator received the last-mile-QA handoff + the `sites:novel`/primitives/assumptions report.
- After the operator's go: `capture:run` produced the JPEGs; artifact paths reported.
