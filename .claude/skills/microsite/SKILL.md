---
name: microsite
description: Build a sales microsite from a client brief — the end-to-end brief-to-site pipeline. Use when the user asks to create/build/generate a microsite, turn a brief into a site, assemble a site from a brief, run the microsite pipeline, or capture screenshots of a generated site. Drives scaffold → author config → assemble pages → theme → HITL → capture.
version: 2.0.0
---

# microsite — brief → SSR site → screenshots

This skill turns a **client brief + at least one brand colour** into a multi-page, SSR Next.js
microsite (Home / About / Contact by default), then captures full-page, multi-viewport screenshots.
**The deliverable is the images, not a live site** — the generated site only needs to look good and
render responsively.

You are the **designer-developer** in the pipeline — not a template filler. The tool is an **assembly
engine**, but your job is to build the *best site this brief deserves*: compose pre-built **sections**
(compound families whose slots you fill with **block primitives** from `@brief-to-site/core/blocks`),
reach for **lucide icons** and expressive Tailwind styling where they add interest, and write
brief-grounded copy. **Aim for a complete, confident site the operator only needs to QA** — see the
invention posture in [`conventions.md`](conventions.md). Let the brief's **Visual direction** drive
real creative choices.

**The escalation ladder, in one line:** for each section, compose an existing **core section** → else
author a **site-local section** (from core blocks) → else a **site-local block** (from core
primitives + icons) → else **add a core primitive** (shadcn MCP). Building new is expected when
nothing fits; the full ladder + locality/QA split is in [`conventions.md`](conventions.md).

## When to use

Use this when the user wants to produce a microsite from a brief, or advance/finish a site already in
progress (author, assemble, theme, or capture). Each phase is a discrete, resumable step.

## The pipeline

```
Intake (brief + colour[s] + visual direction)
  → Scaffold        yarn sites:new <slug>
  → Author config   config/{meta,brand,pages,viewports}.json   → yarn sites:validate
  → Plan the build  per page: section order + how each is composed (design-notes.md)
  → Assemble        compose app/**/page.tsx + author config/placeholders.json per image
  → Theme + assets  yarn theme:build <slug>  ·  yarn placeholders:build <slug>
  → Verify          yarn sites:dev <slug>  ·  test / lint / typecheck
  ── HITL CHECKPOINT ──  STOP. Operator does last-mile QA, then says the word.
  → Capture         yarn capture:run <slug>
```

## Workflow (6 phases)

**Open the phase file when you reach that phase. Do not preload them all.** Each phase is a tight
Goal → steps → Done-condition unit and hands off to the next.

| Phase | File | One-line summary |
| ----- | ---- | ---------------- |
| 1 — Intake | [01-intake.md](01-intake.md) | Collect brief + colour(s) + pages; write `brief.md` to the convention |
| 2 — Scaffold | [02-scaffold.md](02-scaffold.md) | `sites:new`, author the four config files, validate |
| 3 — Plan | [03-plan.md](03-plan.md) | MCP gate; retrieve vocabulary; draft `design-notes.md` (full arc, 5–9 sections) |
| 4 — Assemble | [04-assemble.md](04-assemble.md) | Compose pages from sections/blocks/primitives + icons |
| 5 — Theme & verify | [05-theme-verify.md](05-theme-verify.md) | `theme:build`, `placeholders:build`, dev, test/lint/typecheck |
| 6 — Handoff & capture | [06-handoff-and-capture.md](06-handoff-and-capture.md) | **HITL STOP** → last-mile QA → `capture:run` on the operator's go |

[`conventions.md`](conventions.md) applies across **all** phases — the completeness/invention posture,
the escalation ladder, and the hard bounds (colour math is core-only, root-relative image paths, icons
are a library, no sticky/fixed, no runtime `fs`, OS-agnostic). Read it once up front.

Every step is **non-interactive except the one HITL pause** (phase 6) before capture. All scripts run
from the **repo root** and take a `<slug>` (or explicit site path). Read the project
[`CLAUDE.md`](../../CLAUDE.md) first — it holds the hard-won gotchas the scripts assume.

## Prerequisites

- `yarn install` at the repo root (workspaces).
- For capture only: `yarn playwright install chromium` once per machine (browser binary not committed).
- **Required MCP tooling for assembly:** the **Storybook MCP** and **shadcn MCP** must be available —
  phases 3–4 depend on them for section/primitive docs and **abort** if either is missing (never
  assemble from memory). Probe this at intake so a blocked assembly surfaces before the investment.
