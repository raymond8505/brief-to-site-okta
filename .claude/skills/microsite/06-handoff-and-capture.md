# Phase 6 — Handoff & capture

Goal: hand a **complete** site back to the operator for last-mile QA, then — **only on their go** —
capture the screenshots.

## HITL checkpoint — STOP

**Do not capture yet.** This is the **one intentional pause** in the pipeline — the single human rule
the code can't enforce. Hand control back to the operator.

The site you hand over is **complete**, not a set of open questions. Frame the handoff as **last-mile
QA**, e.g.:

> "Site's generated and complete — review it at `yarn sites:dev <slug>`. Last-mile QA is yours: swap
> any placeholder images (overwrite the files under `public/images/placeholders/`), replace the staged
> stats/quotes with real figures, and tweak copy/layout to taste. Say the word and I'll capture."

Then, framed as **decisions you made, not questions for the operator**:

- Run `yarn sites:novel <slug>` and include its output. For **each** site-local block and section
  listed, note its purpose, what existing tier fell short (no core section fit / block vocabulary
  couldn't express it), and that it's a candidate to promote into core (the operator decides). If the
  list is empty, say so.
- Call out any **primitives** you added to core via the shadcn MCP — those are core changes to review.
- Give a **brief summary of the design-notes assumptions** you made (especially for a thin brief) —
  *"here's what I decided; change it if you disagree,"* not *"here are open questions."*

Only proceed on the operator's explicit go.

## Capture

```bash
yarn capture:run <slug> [--run <name>] [--port <n>]   # default port 3210
```

Spawns the site's dev server, drives Chromium motion-free, and writes full-page JPEGs to
`sites/<slug>/captures/<run>-<ts>/<page>_<width>.jpg` (one per page × viewport). Report the artifact
paths. `captures/` is gitignored — these are the deliverable, handed to the operator.

## Done condition

- Operator received the last-mile-QA handoff + the `sites:novel`/primitives/assumptions report.
- After the operator's go: `capture:run` produced the JPEGs; artifact paths reported.
